<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-if="user.alreadyLogin">{{ user.username }}</v-btn>
        <v-btn flat v-else to="login">Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <Alert></Alert>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Alert from '@/components/Alert'

export default {
  components: { Alert },
  data () {
    return {
      drawer: false,
      items: [{
        icon: 'book',
        title: 'Project',
        to: '/project'
      }],
      miniVariant: false,
      title: '雲端物聯網分析平台'
    }
  },
  mounted: function () {
    console.log(this.$store.state.User.jwt_token)
    if (this.$store.state.User.jwt_token) {
      this.$http.setToken(this.$store.state.User.jwt_token)
      this.$http.getme().then(({data}) => {
        this.$store.commit('SET_USER', data)
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.User
    }
  },
  name: 'App'
}
</script>
