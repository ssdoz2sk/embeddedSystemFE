<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 md8 lg8 offset-md1 offset-lg1>
        <h1>Device: {{device.name}}</h1>
        <div>Device id: {{device.id}}</div>
        <div>Project id: {{device.project}}</div>
        <div>Last update: {{device.updated_at | ISO8601toLocalTime}}</div>
        <div>Description: {{device.sescription}}</div>
      </v-flex>
      <v-flex xs2 md2 lg2 offset-md1>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card slot="activator" color="primary" block dark >
            <v-card-text>新增感測器</v-card-text>
          </v-card>
          <v-card>
            <v-card-title>
              <span class="headline">新增感測器</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Sensor name" v-model="newSensorName" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Sensor name" v-model="newSensorShowName" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="createSensor">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 md10 offset-md1>
        <v-data-table 
          :headers='headers'
          :items='sensors'
          hide-actions
          class='elevation-1'
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.showname }}({{ props.item.name }})</td>
              <td>{{ props.item.last_value }}</td>
              <td>{{ props.item.last_upload | ISO8601toLocalTime }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 md5 offset-md1 v-for="sensor in sensors" :key="sensor.name">
        <highcharts class="stock" :options="sensor.chartOptions" :updateArgs="sensor.updateArgs"></highcharts>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      deviceId: null,
      device: {},
      sensors: [],
      dialog: false,
      newSensorName: '',
      newSensorShowName: '',
      headers: [
        {
          text: 'Name',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Value',
          sortable: false,
          value: 'last_value'
        },
        {
          text: 'Update at',
          sortable: true,
          value: 'last_upload'
        }
      ]
    }
  },
  methods: {
    getDeviceDetail: function (Id) {
      this.$http.getDeviceDetail(Id).then(({data}) => {
        this.device = data
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    getSensorList: function (Id) {
      this.$http.getSensorsByDevice(Id).then(({data}) => {
        this.sensors = data
        for (const [index, sensor] of this.sensors.entries()) {
          this.$set(this.sensors[index], 'updateArgs', [true, true, {duration: 1000}])
          this.$set(this.sensors[index], 'chartOptions', {
            chart: {
              type: 'spline',
              zoomType: 'x'
            },
            rangeSelector: {
              buttons: [{
                type: 'day',
                count: 3,
                text: '3d'
              }, {
                type: 'week',
                count: 1,
                text: '1w'
              }, {
                type: 'month',
                count: 1,
                text: '1m'
              }, {
                type: 'month',
                count: 6,
                text: '6m'
              }, {
                type: 'year',
                count: 1,
                text: '1y'
              }, {
                type: 'all',
                text: 'All'
              }],
              selected: 3
            },
            title: {
              text: sensor.showname
            },
            xAxis: {
              type: 'datetime',
              title: {
                text: 'Time (UTC)'
              }
            },
            plotOptions: {
              spline: {
                marker: {
                  enabled: true
                }
              }
            },
            series: [{
              data: [],
              color: '#6fcd98',
              name: sensor.showname,
              tooltip: {
                valueDecimals: 2
              }
            }]
          })

          let intervalId = setInterval(() => this.getSensorData(sensor.id), 5000)
          this.$set(this.sensors[index], 'intervalId', intervalId)
          this.$set(this.sensors[index], 'last_value', null)
          this.$set(this.sensors[index], 'last_upload', null)
        }
      })
    },
    createSensor: function () {
      this.$http.createSensor(this.newSensorName, this.newSensorShowName, this.deviceId).then(({data}) => {
        this.clearAllInterval()
        this.getSensorList(this.deviceId)
        this.dialog = false
      })
    },
    getSensorData: function (sensorId) {
      this.$http.getDataBySensorId(sensorId).then(({data}) => {
        // console.log(data)
        for (let sensor of this.sensors) {
          if (sensor.id === sensorId) {
            let timedata = []
            let testdata = []
            for (let d of data.data) {
              let time = new Date(d['_upload'] + '+00:00')
              let value = d[sensor.name]
              timedata.push([time.getTime(), value])
              testdata.push(value)
              sensor.last_value = value
              sensor.last_upload = time
            }
            sensor.chartOptions.series[0].data = timedata

            return
          }
        }
      }).catch((err) => console.log(err))
    },
    clearAllInterval: function () {
      for (let sensor of this.sensors) {
        if (sensor.intervalId !== -1) {
          clearInterval(sensor.intervalId)
        }
      }
    }
  },
  mounted: function () {
    if (this.$store.state.User.jwt_token) {
      this.$http.setToken(this.$store.state.User.jwt_token)
      this.deviceId = this.$route.params.id
      this.getDeviceDetail(this.deviceId)
      this.getSensorList(this.deviceId)
    }
  },
  beforeDestroy: function () {
    this.clearAllInterval()
  },
  filters: {
    ISO8601toLocalTime: function (value) {
      if (value) {
        let time = new Date(value)
        return time.toLocaleString()
      }
    }
  },
  name: 'Device Detail'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
