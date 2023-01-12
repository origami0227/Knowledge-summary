//手写事件委托

ul.addEventListener('click', function (e) {
    if (e.target.tagName === 'li') { //如果点击元素的标签名是li
        fn() //执行某个函数
    }
})

// 事件委托高级版
//思路是点击span后遍历span的所有祖先元素看其中有没有ul中的li

function delegate(element, eventType, selector, fn) {
    element.addEventListener(eventType, e => {
        let el = element
        while (!el.matches(selector)) {
            if (element === el) {
                el = null //找到祖先的源头都没找到就置空
                break
            }
            el = el.parentNode //如果点击的不是li 就看父亲元素是不是
        }
        el && fn.call(el, e, el) //调用fn，点击的元素作为this
    })
    return element
}

delegate(ul, 'click', 'li', f1 ) //点击了ul里面的li就会触发f1