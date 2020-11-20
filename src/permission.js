import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // console.log('已登录222')
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } 
    else {
      if (store.getters.roles.length === 0) {
        // console.log('已登录，判断角色')
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          // let menus=res.data.menus;
          let menus=res.menus;
          // let username=res.data.username;
          let username=res.user.name;

          // console.log(username)
          store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
            // console.log("生成路由")
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } 
  else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } 
    else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
