### 手写节流throttle，防抖debounce

目的是写出通用的节流化、防抖化函数。

##### 节流
**通俗来讲，节流就是「技能冷却中」**

假设我们要调用闪现技能，5分钟之内再次调用就会提示在冷却中无法调用。以下是实现思路：

```
const d = () => {
    console.log('flash')
}
//只要调用了d,计时器就会进行计时
let timer = null //使用timer来计时
let cd = false //默认没有进入cd

//完整逻辑
function flash() {
    //如果在cd中 则什么都不做
    if (cd) {
        return
    }
    //否则调用闪现
    d() //真正的闪现功能
    cd = true //进入冷却
    timer = setTimeout(() => {
        cd = false
    }, 300 * 1000) //5分钟后冷却结束
}
```
以上仅以游戏技能为例子来对节流进行一个初步的解释。

下面是**通用化节流**的写法：

```
//接收两个参数，分别是要调用的函数以及时间
const throttle = (fn, time) => {
    let timer = null //使用timer来计时
    let cd = false //默认没有进入cd
    return (...args) => {
        if (cd) {
            return
        }
        fn(...args)
        cd = true //进入cd
        timer = setTimeout(()=>{
            cd = false //cd结束
        },time)
    }
}
```

**使用方法：写好throttle后**
```
const f = throttle(()=>{console.log('hi')},3000)
f() //打印hi
f() //进入cd
```

**简洁版本：**

```
const throttle2 = (fn, time) => {
    //由于节流过程中timer和cd是一起变化的所以可以减少一个
    let timer = null
    return (...args) => {
        if (timer) {
            return
        }
        fn(...args)
        timer = setTimeout(()=>{
            timer = null //重置timer
        },time)
    }
}
```

##### 防抖

**通俗来讲，防抖就是「回城被打断」**

假设我们要实现一个回城的功能，如果回城过程中被攻击了就要重新回城。

实现思路：

```
const b = () => {
    console.log('回城成功')
}
let timer = null

function x() {
    if (timer) {//再次调用x
        clearTimeout(timer) //如果有计时器就要重新计时
    }
    timer = setTimeout(() => {
        b() //八秒后回城成功
        timer = null //重置
    }, 8000)
}
```

**通用化防抖**

```
//通用写法
//被打断重新计时
const debounce = (f, time, asThis) => {
    let timer = null
    return (...args) => {
        if (timer) { //再次调用
            clearTimeout(timer) //如果有计时器就要重新计时
        }
        timer = setTimeout(() => {
            f.call(asThis, ...args)
            timer = null //重置
        }, time)
    }
}
```

**使用方法：写好debounce方法后**

```
const tp = debounce(()=>{},3000)
```

**使用场景：节流一般使用在禁止频繁按钮，比如用户点击按钮后五秒内不能再次点击；防抖一般在用户拼房拖动操作，页面修改大小时重新定位，希望拖动停止后实现一个效果。**

### 发布订阅

发布订阅模型：

```
//eventHub对象上有三个接口
const eventHub = {
    on: (name,fn) => {
       return undefined
    },
    emit: (name,data) => {
       return undefined
    }, //trigger
    off: (name,fn) => {
       return undefined
    }
}
eventHub.on('click',f1) //监听
eventHub.off('click',f1) //取消监听
setTimeout(()=>{
    eventHub.emit('click','Origami') //触发事件
},3000)
```

具体实现：

**on接口实现监听事件放到任务队列中。由于我们可能有很多个队列，所以我们可以做一个映射，使用哈希表**
**off接口就是找到这个事件并把它从任务队列中删除**

```
const eventHub = {
    map: {}, //队列的表
    on: (name, fn) => {
        //防御式编程
        eventHub.map[name] = eventHub.map[name] || [] //初始化
        //入队
        eventHub.map[name].push(fn)
    },
    emit: (name, data) => {
        const fnList = eventHub.map[name]
        if (!fnList) return
        fnList.map(f => f.call(null, data))
        return undefined
    }, //trigger
    off: (name, fn) => {
        //alias设计模式
        const fnList = eventHub.map[name]
        if (!fnList) return
        //找到这个函数
        const index = fnList.indexOf(fn)
        //队列中没有就return
        if (index < 0) return
        //删除
        fnList.splice(index, 1)
    }
}
//使用
eventHub.on('click', console.log) //监听
eventHub.on('click', console.error) //取消监听
setTimeout(() => {
    eventHub.emit('click', 'Origami') //触发事件
}, 3000)
```

**class实现方法**

```
class EventHub {
    map = {}
    on(name, fn) {
        this.map[name] = this.map[name] || [] //初始化
        //入队
        this.map[name].push(fn)
    }

    emit(name, data) {
        const fnList = this.map[name] || []
        fnList.forEach(fn => fn.call(undefined, data))
    }

    off(name, fn) {
        const fnList = this.map[name] || []
        const index = fnList.indexOf(fn)
        if (index < 0) return undefined
        fnList.splice(index, 1)
    }
}

//使用
const e = new EventHub()
e.on('click',(name)=>{
    console.log(name)
})
setTimeout(()=>{
    e.emit('click','Origami')
},3000)
```

### 手写AJAX

基础例子：

```
const xhr = new XMLHttpRequest()

xhr.open('GET', '/xxx') //方法，地址，默认异步
xhr.onload = () => {
    console.log('得到的内容')
}
xhr.onerror = () => {

}
xhr.send('{name:Origami}') //POST时要写请求体
```

标准写法：

```
const ajax = (method, url, data, success, fail) => {
    const request = new XMLHttpRequest()
    request.open(method,url)
    request.onreadystatechange = function (){
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300 || request.status === 304){
                success(request)
            }else {
                fail(request)
            }
        }
    }
    request.send()
}
```

`readyState`用来表示XMLHttpRequest对象的一生。

```
const request = new XMLHttpRequest(); //此时readyState=0 request.open(); //此时readyState=1 request.send(); //此时readyState=2 //响应出第一个字节此时readyState=3 //完全下载完毕此时readyState=4
```

### 手写Promise.all

要点：
1. 知道要在Promise上写而不是在原型上写
2. 知道all的参数（Promise数组）和返回值（新Promise对象）
3. 知道用数组来记录结果
4. 知道只有有一个reject就整体reject

```
//手写Promise.all
//all的参数是一个Promise的数组 返回值是一个Promise对象
Promise.myAll = function (list) {
    const results = [] //使用数组来记录结果
    let count = 0 //计数 表示成功的数量
    return new Promise((resolve, reject) => {
        list.map((promise, index) => {
            promise.then(result => { //成功
                results[index] = result
                count += 1
                if (count >= list.length) {
                    resolve(results) //结束调用resolve
                }
            }, reason => reject(reason))//失败
        })
    })
}
```

### 深拷贝

**方法一使用JSON**

```
const b = JSON.parse(JSON.stringify(a)) //序列化a对象，再反序列化
```

缺点：
1. 不支持Date、正则、undefined、函数等数据
2. 不支持引用（即环状结构）

**方法二：递归**

要点：
1. 递归
2. 判断类型
3. 检查环

### 数组去重

**方法一：Set**

```
//方法一：set

function uniq(a) {
    return Array.from(new Set(a)) //new Set接收一个数组自动去除重复项
}
```

**方法二：Map**
```
//方法二：使用map

function uniq2(a) {
    const map = new Map()
    for (let i = 0; i < a.length; i++) {
        let number = a[i]
        if (number === undefined) {
            continue
        }
        if (map.has(number)) {
            continue
        }
        map.set(number, true) //存放number为map的key
    }
    return [...map.keys()] //以数组的形式返回map的key
}
```