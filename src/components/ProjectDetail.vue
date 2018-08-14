<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 md8 lg8 offset-md1 offset-lg1>
        <h1>Project: {{project.name}}</h1>
        <div>Project id: {{project.id}}</div>
        <div>Last update: {{project.updated_at | ISO8601toLocalTime}}</div>
        <div>Description: {{project.sescription}}</div>
      </v-flex>
      <v-flex xs2 md2 lg1 offset-md1>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card slot="activator" color="primary" block dark >
            <v-card-text>新增裝置</v-card-text>
          </v-card>
          <v-card>
            <v-card-title>
              <span class="headline">新增裝置</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Device name" v-model="newDeviceName" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="createDevice">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md10 offset-md1>
        <v-data-table 
          :headers='headers'
          :items='devices'
          hide-actions
          class='elevation-1'
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td><a @click.self="enterDeviceDetail(props.item.id)">{{ props.item.name }}</a></td>            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 md5 offset-md1 v-for="sensor in sensors" :key="sensor.name">
        <highcharts class="chart" :options="sensor.chartOptions" :updateArgs="sensor.updateArgs"></highcharts>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      project: {},
      devices: [],
      sensors: [],
      dialog: false,
      newDeviceName: '',
      headers: [
        {
          text: 'Name',
          sortable: true,
          value: 'name'
        }
      ]
    }
  },
  methods: {
    getProjectDetail: function (Id) {
      this.$http.getProjectDetail(Id).then(({data}) => {
        this.project = data
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    getDeviceList: function (projectId) {
      this.$http.getDevices(projectId).then(({data}) => {
        this.devices = data
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    getSensorList: function (projectId) {
      this.$http.getSensorsByProject(projectId).then(({data}) => {
        this.sensors = data

        for (const [index, sensor] of this.sensors.entries()) {
          this.$set(this.sensors[index], 'updateArgs', [true, true, {duration: 1000}])
          this.$set(this.sensors[index], 'chartOptions', {
            chart: {
              type: 'spline'
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
              name: sensor.showname
            }]
          })

          let intervalId = setInterval(() => this.getSensorData(sensor.id), 5000)
          this.$set(this.sensors[index], 'intervalId', intervalId)
        }
      }).catch(error => {
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    createDevice: function () {
      this.$http.createDevice(this.newDeviceName, this.projectId).then(({data}) => {
        this.getDeviceList()
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    enterDeviceDetail (id) {
      this.$router.push({name: 'deviceDetail', params: {id: id}})
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
      this.projectId = this.$route.params.id
      this.getProjectDetail(this.projectId)
      this.getDeviceList(this.projectId)
      this.getSensorList(this.projectId)
    }
  },
  beforeDestroy: function () {
    this.clearAllInterval()
  },
  filters: {
    ISO8601toLocalTime: function (value) {
      let time = new Date(value)
      return time.toLocaleString()
    }
  },
  name: 'ProjectDetail'
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
