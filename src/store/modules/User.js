const state = {
  id: null,
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isStaff: false,
  alreadyLogin: false,
  jwt_token: window.localStorage.getItem('jwt_token')
}

const mutations = {
  SET_USER (state, user) {
    state.id = user.id
    state.username = user.username
    state.firstName = user.first_name
    state.lastName = user.last_name
    state.email = user.email
    state.isStaff = user.is_staff
    state.alreadyLogin = true
  },
  SET_JWT_TOKEN (state, token) {
    window.localStorage.setItem('jwt_token', token)
    state.token = token
  },
  REMOVE_JWT_TOKEN (state) {
    state.token = null
    window.localStorage.removeItem('jwt_token')
  },
  REMOVE_USER (state) {
    state.alreadyLogin = false
  }
}

export default {
  state,
  mutations
}
