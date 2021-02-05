import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/base',
    component: Layout,
    redirect: '/base/project',
    name: 'base',
    meta: {title: '基础信息设置', icon: 'product'},
    children: [{
      path: 'project',
      name: 'project',
      component: () => import('@/views/project/index'),
      meta: {title: '项目管理', icon: 'product-list'}
    },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {title: '用户管理', icon: 'product-add'}
      },
    //   {
    //     path: 'updateProduct',
    //     name: 'updateProduct',
    //     component: () => import('@/views/pms/product/update'),
    //     meta: {title: '修改商品', icon: 'product-add'},
    //     hidden: true
    //   },
      {
        path: 'env',
        name: 'env',
        component: () => import('@/views/env/index'),
        meta: {title: '环境管理', icon: 'product-cate'}
      },

      {
        path: 'model',
        name: 'model',
        component: () => import('@/views/model/index'),
        meta: {title: '模块管理', icon: 'product-attr'}
      }
    ]
  },
  {
    path: '/api',
    component: Layout,
    redirect: '/api/api-list',
    name: 'api',
    meta: {title: '接口管理', icon: 'order'},
    children: [
      {
        path: 'api-list',
        name: 'api-list',
        component: () => import('@/views/api/index'),
        meta: {title: '接口列表', icon: 'product-list'}
      },

      {
        path: 'addApi',
        name: 'addAPI',
        component: () => import('@/views/api/add'),
        meta: {title: '添加接口'},
        hidden:true
      },
      {
        path: 'updateApi',
        name: 'updateApi',
        component: () => import('@/views/api/update'),
        meta: {title: '修改接口'},
        hidden:true
      },
      {
        path: 'copyapi',
        name: 'copyapi',
        component: () => import('@/views/api/copyapi'),
        meta: {title: '接口复制'},
        hidden:true
      },

      {
        path: 'customepara',
        name: 'customepara',
        component: () => import('@/views/api/customepara'),
        meta: {title: '自定义变量设置', icon: 'order-setting'}
      },

      {
        path: 'fasttest',
        name: 'fasttest',
        component: () => import('@/views/api/fasttest'),
        meta: {title: '快速测试', icon: 'order-return'}
      },
      {
        path: 'apimock',
        name: 'apimock',
        component: () => import('@/views/api/apimock'),
        meta: {title: 'Mock接口', icon: 'order-return-reason'}
      },
      {
        path: 'customfunc',
        name: 'customfunc',
        component: () => import('@/views/api/customfunc'),
        meta: {title: '自定义py函数'},
        hidden:true
      },
      {
        path: 'parsejson',
        name: 'parsejson',
        component: () => import('@/views/api/parsejson'),
        meta: {title: 'JSON美化'},
        hidden:true
      },
    ]
  },
  {
    path:'/case',
    component: Layout,
    redirect: '/case/case-list',
    name: 'case',
    meta: {title: '用例管理', icon: 'sms'},
    children: [
      {
        path: 'case-list',
        name: 'case-list',
        component: () => import('@/views/case/index'),
        meta: {title: '用例列表', icon: 'sms-flash'}
      },
      {
        path: 'addCaseStep/:caseId',
        name: 'addCaseStep',
        component: () => import('@/views/case/caseStep'),
        meta: {title: '添加用例步骤'},
        hidden:true
      },
    ]
  },

  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

