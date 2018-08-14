import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Project from '@/components/Project'
import ProjectDetail from '@/components/ProjectDetail'
import DeviceDetail from '@/components/DeviceDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/project/:id',
      name: 'projectDetail',
      component: ProjectDetail
    },
    {
      path: '/device/:id',
      name: 'deviceDetail',
      component: DeviceDetail
    }
  ]
})
