// 手写节流防抖

//接收两个参数，分别是要调用的函数以及时间
const throttle = (fn, time) => {
    let timer = null //使用timer来计时
    let cd = false //默认没有进入cd
    return (...args) => {
        if (cd) {
            alert('cd中')
        }
        fn(...args)
        cd = true
        timer = setTimeout(() => {
            cd = false
        }, time)
    }
}
//使用
const f = throttle(() => {
    console.log('hi')
}, 3000)
f() //打印hi
f() //进入cd


//简洁版本 减少cd变量

const throttle2 = (fn, time) => {
    //由于节流过程中timer和cd是一起变化的所以可以减少一个
    let timer = null
    return (...args) => {
        if (timer) {
            return
        }
        fn(...args)
        timer = setTimeout(() => {
            timer = null //重置timer
        }, time)
    }
}

// 手写防抖

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

const tp = debounce(b, 3000)


//反转链表
//定义一个cur指针，指向头节点
//定义一个pre指针初始化为pre
const reverseList = function (head) {
    if (!head || !head.next) return head
    let temp = null //用来保存
    let pre = null
    let cur = head
    while (cur) {
        temp = cur.next
        cur.next = pre
        pre = cur
        cur = temp //temp = cur = null
    }
    return pre
}

// 手写 发布订阅
//eventHub对象上有三个接口
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

//class 实现

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
e.on('click', (name) => {
    console.log(name)
})
setTimeout(() => {
    e.emit('click', 'Origami')
}, 3000)

//手写AJAX

const ajax = (method, url, data, success, fail) => {
    const request = new XMLHttpRequest()
    request.open(method, url)
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300 || request.status === 304) {
                success(request)
            } else {
                fail(request)
            }
        }
    }
    request.send()
}

//手写Promise.all
//all的参数是一个Promise的数组 返回值是一个Promise对象
Promise.myAll = function (list) {
    const results = []
    let count = 0
    return new Promise((resolve, reject) => {
        list.map((promise, index) => {
            promise.then(result => {
                results[index] = result
                count += 1
                if (count >= list.length) {
                    resolve(results)
                }
            }, reason => reject(reason))
        })
    })
}

//手写数组去重

//方法一：set

function uniq(a) {
    return Array.from(new Set(a)) //new Set接收一个数组自动去除重复项
}

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




