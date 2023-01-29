let a = {
    tag: 'div',
    props: {
        id: 'x'
    },
    children: [
        {
            tag: 'span',
            props: {
                className: 'red'
            },
            children: [
                'hi'
            ]
        }
    ]
}
React.createElement("div", {id: "x"},
    React.createElement('span', {class: "red"}, "hi")
)

//虚拟节点渲染成真实节点

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