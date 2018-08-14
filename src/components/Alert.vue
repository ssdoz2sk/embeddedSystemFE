<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-alert :value="show" :type="type">{{ message }}</v-alert>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    show () {
      return this.$store.state.Alert.show
    },
    message () {
      return this.$store.state.Alert.message
    },
    type () {
      return this.$store.state.Alert.type
    }
  },
  name: 'Alert'
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
