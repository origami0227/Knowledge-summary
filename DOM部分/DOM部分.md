### 简述DOM事件模型

**先经历从上到下的捕获阶段，再经历从下到上的冒泡阶段。**
`addEventListener`第三个参数可以选择阶段。（true是捕获，false或者不传就是冒泡）
可以使用`event.stopPropagation()`来阻止捕获或者冒泡。


### 事件委托

**错误版（但可能通过面试）**

```
ul.addEventListener('click', function (e) {
    if (e.target.tagName === 'li') { //如果点击元素的标签名是li
        fn() //执行某个函数
    }
})
```
**这样写的bug在于：如果用户点击的是li里面的span就不会触发fn这个函数。**

**事件委托优点：**
1. 节省监听器
2. 实现动态监听

**缺点：**
1. 调试复杂，不容易确定监听者

---

**高级版**

思路：**点击span后，递归遍历span的祖先元素有没有ul中的li**

```
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
```

### 手写可拖拽div

要点：
**1. 注意监听范围，不能只监听div**
**2. 不要使用drag事件，很难用**
**3. 使用transform性能会更好**


```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>可拖拽div</title>
    <style>
        div {
            border: 1px solid red;
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
        }

        * {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<div id="xxx"></div>
</body>
</html>
<script>
    let dragging = false
    let position = null
    xxx.addEventListener('mousedown', function (e) {
        //鼠标按下时，标记正在拖拽并
        dragging = true
        position = [e.clientX, e.clientY] //记录初始位置
    })
    document.addEventListener('mouseover', function (e) {
        if (dragging === false)  return //没有移动就不拖拽
        const x = e.clientX
        const y = e.clientY //移动时记录鼠标移动的xy
        const deltaX = x - position[0]
        const deltaY = y - position[1] //和上一次position的差值
        const left = parseInt(xxx.style.left || 0)
        const top = parseInt(xxx.style.top || 0) //获取原始的 left以及top
        xxx.style.left = left + deltaX + 'px'
        xxx.style.top = top + deltaY + 'px'
        position = [x, y] //移动记录到position里面 下一次移动只用知道两次的差即可
    })
    document.addEventListener('mouseup', function (e) {
        dragging = false //鼠标松开
    })
</script>
```


