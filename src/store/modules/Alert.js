const state = {
  show: false,
  message: '',
  type: undefined
}

const mutations = {
  SET_ALERT (state, options) {
    state.show = true
    state.type = options.type
    state.message = options.message
  },
  REMOVE_ALERT (state) {
    state.show = false
  }
}

const actions = {
  SET_ALERT (context, options) {
    let countdown = options.countdown || 10

    context.commit('SET_ALERT', options)
    setTimeout(() => {
      context.commit('REMOVE_ALERT')
    }, countdown * 1000)
  }
}

export default {
  state,
  mutations,
  actions
}
