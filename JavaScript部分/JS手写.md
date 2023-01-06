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