### Vue2的生命周期钩子有哪些？数据请求放在哪个钩子

1. create * 2 `beforeCreate`和`created`
2. mount * 2 `beforeMount`和`mounted`
3. update * 2 `beforeUpdate``updated`
4. destory * 2 `beforeDestroy``destroyed`

还有三个写在钩子列表里：

1. `activated` （被keep-alive缓存的组件激活时调用）
2. `deactivated` （被keep-alive缓存的组件失活时调用）
3. `errorCaptured`


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10d09a0d0b774031b957c6683237866b~tplv-k3u1fbpfcp-watermark.image?)

**数据请求放在mounted里面**

如果放在create里面会在后端SSR执行一次，前端执行一次，这不符合我们的预期。放在update里面如意造成无限循环。

### Vue2组件间通信方式

1. 父子组件：使用「props和事件」进行通信
2. 爷孙组件：

   a. 使用两次父子组件间通信来实现

   b. 使用「provide和inject」来通信

3. 任意组件：`使用eventBus = new Vue()`来通信

   a. 主要API是`eventBus.$on`和`eventBus.$emit`

   b. 缺点是事件多了会混乱，难以维护

4. 任意组件：使用Vuex通信（Vue3可用Pinia代替Vuex）


### Vuex用过吗？怎么理解？

1. Vuex是专为Vue.js应用程序开发的状态管理模式+库
2. 说出核心概念的名字和作用：`store/State/Getter/Mutation/Action/Module`

   a. store是个大容器，包含以下所有内容

   b. State用来读取状态，带有一个mapState辅助函数

   c. Getter用来读取派生状态，富有一个mapGetters辅助函数

   d. Mutation用于同步提交状态变更，富有一个mapMutation辅助函数

   e. Action用于异步变更状态，但他提交的是mutation，而不是直接变更状态。

   f. Module用来给store划分模块，方便维护代码

**Mutation和Action为什么要分开**

为了让代码更易于维护。

### VueRouter用过吗？怎么理解？

1. Vue Router是Vue.js的官方路由。适用于单页面应用。
2. 说出核心该你那的名字和作用：`router-link`,`router-view`,嵌套路由,Hash模式,History模式,导航守卫,懒加载。

**Hash模式和History模式区别**

1. 一个用的Hash，一个用的History API
2. Hash不需要后端nginx配合，History需要

**导航守卫如何实现登录控制**

```
router.beforeEach((to,from,next)=>{
    if(to.path === '/login') return next()
    if(to是受控页面 && 没有登录) return next('/login?return_to='+to.path)
    next()
})
```

### Vue2是如何实现双向绑定的

1. 一般使用v-model实现，`v-model`是`v-bind:value`和`v-on:input`的语法糖。

   a. `v-bind:value`实现了 data =》 UI的单向绑定

   b. `v-on:input`实现了UI =》data的单向绑定

   c. 合起来就是双向绑定

2. 这两个单向绑定如何实现的？

   a. 前者通过`Object.defineProperty`API给data创建getter和setter，用于监听data的改变，data一变就会改变UI

   b. 后者通过template compiler给DOM添加事件监听，DOM input的值改变了就回去修改data。