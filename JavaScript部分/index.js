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

const tp = debounce(b,3000)
