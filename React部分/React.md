### 虚拟DOM的原理

**是什么：**虚拟DOM就是**虚拟节点**。React用JS对象来模拟DOM节点，然后将其渲染成真实的DOM节点。

**怎么做**

第一步是**模拟**，用JSX语法写出来的div其实是一个虚拟节点：

```
<div id="x">
   <span class="red">hi</span>
</div>
```

这个代码会得到这样的一个对象：

```
{
    tag:'div',
    props:{
        id:'x'
    },
    children:[
        {
            tag:'span',
            props:{
                className:'red'
            },
            children: [
                'hi'
            ]
        }
    ]
}
```

能做到这一点是因为JSX语法会被转译为`createElement`函数调用，如下：

```
React.createElement("div", {id: "x"},
    React.createElement('span', {class: "red"}, "hi")
)
```

第二步是**将虚拟节点渲染成真实节点**

```
function render(vdom){
    //如果是字符串或者数字，创建一个文本节点
    if(typeof vdom === 'string' || typeof vdom === 'number'){
        return document.createTextNode(vdom)
    }
    const {tag,props,children} = vdom
    //创建真实DOM
    const element = document.createElement(tag)
    //设置属性
    setProps(element,props)
    //遍历子节点，并获取创建真实DOM，插入当前节点
    children
        .map(render)
        .forEach(element.appendChild(element))
    //虚拟DOM中缓存真实DOM节点
    vdom.dom = element
    //返回DOM节点
    return element
}
function setProps(){}//略

//作者：Shenfq
```

注意：如果节点发生变化，并不会直接把新虚拟节点渲染到真实节点，而是先经过diff算法得到一个patch再更新到真实节点上。

**解决了什么问题**
1. DOM操作性能问题。通过虚拟DOM和diff算法减少不必要的DOM操作，保证性能不太差。
2. DOM操作不方便问题。以前各种DOM API要记，现在只有`setState`

**优点**
1. 为React带来了跨平台能力，因为虚拟节点除了渲染为真实节点还可以渲染为其他东西。
2. 让DOM操作的整体性能更好，通过diff溅洒红不必要的DOM操作。

**缺点**
1. 性能要求极高的地方，还是需要用真实DOM操作
2. React为虚拟DOM创造了合成时间，和原生DOM事件不太一样

   a. 所有React事件都绑定的到根元素，自动实现事件委托

   b. 如果混用合成事件和原生DOM事件，有可能出现bug


### DOM diff 算法是怎么样的

**是什么**

DOM diff 就是对比两棵虚拟DOM树的算法。当组件变化时，会render出一个新的虚拟DOM，diff算法对比新旧虚拟DOM之后，得到一个patch，然后React用patch来更新真实DOM。

**怎么做**

1. 首先对比两棵树的根节点

   a. 如果根节点的类型改变了，比如div变成了p，那么直接认为整棵树都变了，不再对比子节点。此时直接删除对应的真实DOM树，创建真实DOM树。

   b. 如果根节点的类型没变，就看属性有没有变化

   i.如果没变，就保留对应真实节点

   ii. 如果变了，就只更新该节点的属性，不重新创建节点。更新style时，如果多个css属性只有一个改变了，那么React只更新改变的。

2. 然后同时遍历两棵树的子节点，每个节点的对比过程同上

特殊情况：

```
<ul>
   <li>B</li>
   <li>C</li>
</ul>

<ul>
   <li>A</li>
   <li>B</li>
   <li>C</li>
</ul>
```
React会对比B-A，会删除B文本新建A文本；对比C-B，会产出C文本，新建B文本；（把操作会汇总patch里再进行DOM操作）对比空-C，会新建C文本。但是我们可以发现主需要创建A文本，保留B和C即可。

**因为React需要你加key**

```
<ul>
   <li key="b">B</li>
   <li key="c">C</li>
</ul>

<ul>
   <li key="a">A</li>
   <li key="b">B</li>
   <li key="c">C</li>
</ul>
```
这样React线对比key发现key只新增了一个，于是保留b和c，新建a。
以上是React的diff算法。


**Vue 双端交叉对比**


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c14c5a96578462288a126c808019e0a~tplv-k3u1fbpfcp-watermark.image?)

假设有旧的Vnode数组和新的Vnode数组这两个数组,而且有四个变量充当指针分别指到两个数组的头尾.

重复下面的对比过程，直到两个数组中任一数组的头指针超过尾指针，循环结束 :
-   头头对比: 对比两个数组的头部，如果找到，把新节点patch到旧节点，头指针后移
-   尾尾对比: 对比两个数组的尾部，如果找到，把新节点patch到旧节点，尾指针前移
-   旧尾新头对比: 交叉对比，旧尾新头，如果找到，把新节点patch到旧节点，旧尾指针前移，新头指针后移
-   旧头新尾对比: 交叉对比，旧头新尾，如果找到，把新节点patch到旧节点，新尾指针前移，旧头指针后移
-   利用key对比: 用新指针对应节点的key去旧数组寻找对应的节点,这里分三种情况,当没有对应的key，那么创建新的节点,如果有key并且是相同的节点，把新节点patch到旧节点,如果有key但是不是相同的节点，则创建新节点


### React生命周期钩子函数有哪些？数据存储放在那个生命周期函数？

[图解](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

总体来说：

1. 挂载时调用constructor，更新时不调用
2. 更新时调用`shouldComponentUpdate`和`getSnapshotBeforeUpdate`，挂载时不调用
3. `shouldComponentUpdate`在render前调用，`getSnapshotBeforeUpdate`在render后调用
4. 请求放在`componnetDidMount`里。**原因是：更新时触发的生命周期函数会调用多次，可能会触发多余调用或无限调用；此外constructor会在ssr时调用，所以不能放ajax请求；卸载时调用是毫无意义的。**

### React如何实现组件间通讯？如何理解redux？


1. 父子组件通信：props + 函数
2. 爷孙组件通信：两层父子通信或者使用`Context.Provider`和`Context.Consumer`
3. 任意组件通信： 状态管理

   a. Redux

   b. Mobx

   c. Recoil


##### Redux

1. Redux是一个状态管理库/状态容器
2. Redux的核心概念：

   a. State

   b. Action = type + payload 荷载

   c. Reducer

   d. Dispatch 后面接Action——派发

   e. Middleware

3.  ReactRedux的核心概念：

a. connect()

b. mapStateToProps

c. mapDispatchtoProps

4. 常见中间件 redux-thunk redux-promise


### 什么是高阶组件HOC

参数是组件，返回值也是组件的函数。（抽象问题）

举例说明：

1. `React.forwardRef`
2. ReactRedux的connect
3. ReactRouter的withRouter


![截屏2023-02-02 10.37.57.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b39ca5bffdf945c2886aa7cab62f30a1~tplv-k3u1fbpfcp-watermark.image?)
要想持久化保存这个button需要ref。

![截屏2023-02-02 10.38.38.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f9cb0f60c845fd976609728f2ad7dd~tplv-k3u1fbpfcp-watermark.image?)

### React Hooks 如何模拟组件生命周期

1. `componentDidMount`
2. `componentDidUpdate`
3. `componentWillUnmount`


