### Vue 3为什么使用Proxy

1. 弥补Object.defineProperty的两个不足

   a. 动态创建的data属性需要用Vue.set来赋值，Vue 3用了Proxy就不需要了

   b. 基于性能考虑，Vue 2篡改了数组的7个API，Vue 3用了Proxy就不需要了

2. defineProperty需要提前递归地遍历data做到响应式，而Proxy可以在真正用到深层数据的时候再做响应式（惰性）


### Vue 3为什么使用Composition API

1. Composition API 比mixins、高阶组件、extends、Renderless Components等更好，原因有三：

   a. 模板中的数据来源不清晰

   b. 命名空间冲突

   c. 性能

2. 更适合TypeScript


### Vue 3对于Vue 2做了哪些改动

1. `createApp()`代替了`new Vue()`
2. `v-model`代替了以前的`v-model`和`.sync`
3. 根元素可以有不止一个元素了
4. destroyed被改名为unmounted了
5. ref属性支持函数了
6. 新增Teleport传送门