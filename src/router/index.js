import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Project from '@/components/Project'
import ProjectDetail from '@/components/ProjectDetail'
import DeviceDetail from '@/components/DeviceDetail'
import SensorDetail from '@/components/SensorDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/project'
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
    },
    {
      path: '/sensor/:id',
      name: 'sensorDetail',
      component: SensorDetail
    }
  ]
})
