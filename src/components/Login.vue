<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-text-field
            label="Username"
            placeholder="Username"
            v-model="username"
          ></v-text-field>
          <v-text-field
            label="Password"
            placeholder="Password"
            v-model="password"
            type="password"
          ></v-text-field>
          <v-btn color="success" @click="login">Login</v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login: function (event) {
      this.$http.login(this.username, this.password).then(({data}) => {
        let token = data.token
        this.$store.commit('SET_JWT_TOKEN', token)
        this.$http.setToken(token)
        return this.$http.getme()
      }).catch(error => {
        this.$store.dispatch('SET_ALERT', {type: 'error', message: error.response.data.message || error.response.data.detail})
      }).then(({data}) => {
        this.$store.commit('SET_USER', data)
        this.$router.push('/')
      })
    }
  },
  mounted: function () {
    if (this.$store.state.User.alreadyLogin) {
      this.$router.push('/')
    }
  },
  name: 'Login'
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
