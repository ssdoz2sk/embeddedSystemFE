<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs2 md2 offset-xs10 offset-md10>
          <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card slot="activator" color="primary" block dark >
              <v-card-text>新增專案</v-card-text>
            </v-card>
            <v-card>
              <v-card-title>
                <span class="headline">新增專案</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field label="Project name" v-model="newProjectName" required></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="createProject">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-data-table 
            :headers='headers'
            :items='projects'
            hide-actions
            class='elevation-1'
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td><a @click.self="enterProjectDetail(props.item.id)">{{ props.item.name }}</a></td>
                <td>{{ props.item.creater }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      newProjectName: '',
      headers: [
        {
          text: 'Name',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Owner',
          sortable: true,
          value: 'creater'
        }
      ],
      projects: []
    }
  },
  methods: {
    getProjects: function (event) {
      this.$http.getProjects().then(({data}) => {
        this.projects = data
      }).catch(error => {
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      })
    },
    createProject () {
      this.dialog = true
      this.$http.createProject(this.newProjectName).then(({data}) => {
        this.getProjects()
        this.dialog = false
      })
    },
    enterProjectDetail (id) {
      this.$router.push({name: 'projectDetail', params: {id: id}})
    }
  },
  mounted: function () {
    if (this.$store.state.User.jwt_token) {
      this.$http.setToken(this.$store.state.User.jwt_token)
      this.getProjects()
    }
  },
  name: 'Project'
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
