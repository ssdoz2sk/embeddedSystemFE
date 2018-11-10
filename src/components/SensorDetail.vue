<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 md8 lg8 offset-md1 offset-lg1>
        <h1>感測器名稱: {{sensor.name}}</h1>
        <div>感測器顯示名稱: {{sensor.showname}}</div>
        <div>最後更新時間: {{device.updated_at | ISO8601toLocalTime}}</div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-card>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>Calories:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ props.item.calories }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
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
      this.$http.getDataBySensorId(sensorId).then((data) => {
        // console.log(data)
        let timedata = []
        let testdata = []
        for (let d of data) {
          let time = new Date(d['timestamp'] * 1000)
          let value = d[sensor.data]
          timedata.push([time.getTime(), value])
          testdata.push(value)
          sensor.last_value = value
          sensor.last_upload = time
        }
        sensor.chartOptions.series[0].data = timedata

        return
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
