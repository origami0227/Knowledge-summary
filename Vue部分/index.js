//导航守卫

router.beforeEach((to,from,next)=>{
    if(to.path === '/login') return next()
    if(to是受控页面 && 没有登录) return next('/login?return_to='+to.path)
    next()
})