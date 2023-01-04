### JS的数据类型都哪些

**一共八种：string——字符串、bool——布尔、number——数字、bigint——大整数、null、undefined、symbol——符号、object——对象。**

一般情况下表示对象为空用null；非对象为空用undefined。

**为什么需要bigint？**
js的number默认是双精度浮点数，精度有限。使用bigint则可以解决这个问题。（bigint只支持整数）

### 原型链

**大概念题：答题思路为大概念分为小概念（分割），抽象画成具体（举例）**


**原型链涉及到的概念比较多，所以进行举例说明。**

假设一个普通对象`x={}`，这个`x`会有一个隐藏属性，叫做`_proto_`，这个属性会指向`Object.prototype`。即

```
x._proto_ === Object.prototype //原型
```
此时，我们可以说`x`的原型就是`Object.prototype`或者说`Object.prototype`是`x`的原型。

这个`_proto_`属性的唯一作用就是来指向`x`的原型的。如果没有`_proto_`那么`x`就不会知道自己的原型是谁。


**接下来说一下原型链，同样也举例说明**

假设我们有一个数组对象`a=[]`，这个`a`也会有一个隐藏属性，叫做`__proto__`,这个属性会指向`Array.prototype`,即

```
a.__proto__ === Array.prototype
```

此时，我们可以说a的原型是`Array.prototype`，跟上面的x一样，但也不完全一样。因为`Array.prototype`的有一个隐藏属性，叫做`__proto__`,这个`__proto__`又指向了`Object.prototype`，即

```
//x表示 Array.prototype
x.__proto__ === Object.prototype
```
这样一来，a就有两层原型：
1. `a`的原型是`Array.prototype`
2. `a`的原型的原型是`Object.prototype`

于是通过隐藏属性`__proto__`形成了一个链条

```
a ===> Array.prototype ===> Object.prototype
```
这就是原型链。
**以上是我对原型链是什么的回答**

**怎么做：**
看起来只要改写x的隐藏属性`__proto__`即可改变x的原型（链）
```
x.__proto__ = 原型
```

**但这并不是标准推荐的写法，为了设置`x.__proto__`，推荐的写法是**

```
cosnt x = Object.create(原型)
//或者
cosnt x = new 构造函数() //可以让x.__proto__ === 构造函数.prototype
```

**解决了什么问题：**
在没有Class的情况下实现「继承」。以`a ===> Array.prototype ===> Object.prototype`为例，我们说：
1. a是Array的实例，a拥有Array.prototype里面的属性
2. Array继承了Object
3. a是Object的间接实例，a拥有Object.prototype里的属性
   这样一来a就即拥有了Array.prototype里的属性又有Object.prototype里的属性。

**优点：简单优雅**

**缺点：与class相比，不支持私有属性**

**如何解决：使用class。但是class是ES6引入的，不被旧IE浏览器支持。**


### this问题

**是什么：`this`是`call`的第一个参数**

举个例子：

```
obj.child.method(p1,p2) 等价于
obj.child.menthod.call(obj.child,p1,p2) //this就是obj.child

fn(a)等价于
fn.call(undefined,a) //this就是undefined
```

**值得注意的是：浏览器在发现this是undefined的时候会自动把this变为window。**

一道经典的问题：
```
var length = 4; //全局变量自动变成window的属性，等价于window.length
function callback() { 
  console.log(this.length); // => 打印出什么？
} 
const obj = { 
  length: 5, //第二次出现length
  method(callback) { 
    callback(); //调用前做了一次传递，一次callback是参数另一次是调用，这一次是真正调用callback
  } 
}; 

obj.method(callback, 1, 2); 
```

题目中的`callback()`用call的形式进行改写为`callback.call(undefined)`**其中的this为undefined，浏览器会将其改为window。**
所以等同于打印出`window.length`。所以结果为4。


一道比较难的题：
```
array = [function(){console.log(this)},2] //数组第一个元素是函数，第二个元素是数字
array[0]() //这里打出的this是什么？
```
直接进行转换代码
```
array[0]() //相当于
array.0() => 0.call(array) //this就是array
```

### new做了什么

**记忆题：**
1. 创建临时对象
2. 绑定原型（共有属性）
3. 指定this = 临时对象
4. 执行构造函数（私有属性）
5. 返回临时对象

### call、apply、bind的用法

##### call

call 方法第一个参数是要绑定给this的值，后面的参数是arguments 或其他参数。当第一个参数为null、undefined的时候，默认指向window。

```
function add(a,b){
  return a+b;
}
add.call(undefined,1,2)//3 其中1和2是连续的参数
```
##### apply

apply接受两个参数，第一个参数是要绑定给this的值，第二个参数是一个参数数组。当第一个参数为null、undefined的时候，默认指向window。

```
function add(a,b){
  return a+b;
}
add.apply(undefined,[1,2]//3 其中1和2数参数数组
```

##### bind

第一个参数是this的指向，从第二个参数开始是接收的参数列表。bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。
也就是说：
-   fn.bind(x,y,z) 不会执行 fn，而是会返回一个新的函数
-   新的函数执行时，会调用 fn，调用形式为 fn.call(x, y, z)，其中 x 是 this，y 和z 是其他参数
```
function add(a, b){
  return a+b;
}
var foo1 = add.bind(add, 1,2); 
foo1(); //3 只有调用才会执行
```
注意：在 ES6 的箭头函数下, call 和 apply 将失效。

### 立即执行函数

**是什么：声明一个匿名函数，然后立刻执行它。这种做法就是立即执行函数**

**怎么做：举例子**

```
(function(){alert('我是匿名函数')}()); //用括号把整个表达式包起来
(function(){alert('我是匿名函数')})() //用括号把函数包起来
!function(){alert('我是匿名函数')}() //求反，不在意值是多少，只想通过语法检查
~function(){alert('我是匿名函数')}() 
+function(){alert('我是匿名函数')}()  //返回一个NaN
-function(){alert('我是匿名函数')}() 
void function(){alert('我是匿名函数')}() 
new function(){alert('我是匿名函数')}() //会返回一个空对象
var x = function(){return '我是匿名函数'}()
```
以上每一行代码都是一个立即执行函数。

**解决了什么问题：在ES6之前，只能通过它来「创建局部作用域」**

**优点：兼容性好**

**缺点：丑**

**怎么解决缺点： 使用ES6的block+let语法**

```
{
  let a = '局部变量'
  console.log(a) //能够读取a
}
console.log(a) //找不到a
```

### 闭包

**是什么：闭包是JS的一种语法特性**

> 闭包 = 函数 + 自由变量

对于一个函数来说，变量分为：全局变量、本地变量、自由变量

**怎么做：**

```

let count
function add(){ //访问了外部变量的函数
   count += 1
}
```
把以上代放在「非全局环境里」，就是闭包。

> 注意，闭包不是count，也不是add，闭包是count+add组成的整体。

如何制造一个「非全局环境」呢？**答案是立即执行函数**

```
const x = function(){
   var count 
   function add(){ //访问了外部变量的函数
      count += 1
   }
}()
```
但是这个代码是没有用的，我们需要 `return add`即，
```
const add2 = function(){
   var count 
   return function add(){ //访问了外部变量的函数
      count += 1
   }
}()
```
此时add2就是add，我们可以调用add2

```
add2()
//相当于
add()
//相当于
count += 1
```

至此，我们实现了一个完整的「闭包的应用」。

**解决了什么问题：**
1. 避免污染全局环境。
2. 提供对局部变量的间接访问。
3. 维持变量，使其不被垃圾回收。

**优点：简单好用**

**缺点：**

闭包**使用不当可能造成内存泄漏**

举例说明：
```
function test(){
   var x = {name:'x'}
   var y = {name:'y',content:"----很长，有上万字符串那么长"}
   return fn(){
      return x //return 执行后 y应该被垃圾回收
   }
}

const myFn = test() //myFn 就是 fn了
const myX = fn() // myX 就是x了

```

对于一个正常的浏览器来说，y在一段时间后会自动消失（被垃圾回收器回收掉），但是旧版本的IE并不会这么做。

**我们应该少用闭包，因为有的浏览器对闭包的支持不够好**

**如何解决：慎用，少用，不用**


### 如何实现类

**方法一：使用原型**

