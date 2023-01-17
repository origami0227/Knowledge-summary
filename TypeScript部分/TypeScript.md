### TypeScript环境

由于浏览器无法识别typescript所以我们想要执行typescript代码需要通过一些办法将其转译为js。

1. webpack + babel
2. Vite
3. tsc （typescript compiler）

### 类型 vs 类

```
var x = 'hi' //javascript
var x:string = 'hi' //typescript
```
TypeScript实际上就是JavaScript在每个变量后面加上类型。

**我们需要复习一下JS的基本类型：null,undefined,bool,number,symbol,bigint,string,object。**

**类型**规定的就是数据类型也就是`type`。

而**类**只与上面的复杂类型`object`有关。这就引出了一种常用思想——面向对象的编程思想。一种是基于class的面向对象编程、另一种是基于原型的面向对象编程。而js这两种都支持。[具体内容可以看我之前的一篇博客。](https://juejin.cn/post/7184998810622361657)

### 类型的好处

1. 减少bug

```
const a = '1'
const b = a + 1
console.log(b) // 11
```
由于js容忍不同类型的数字相加，a是字符串，1是数字，所以b最后等于11。这显然不是我想要的结果。用`类型`就可以避免这样的bug

```
function add(a:number, b:number){
   return a + b
}
add('1',1) //此时会报错避免bug
```

2. 有更好的代码提示，预测代码bug

### TypeScript语法

1. `:类型`
2. TS支持的全部的JS类型

```
const a:undefined = undefined
const b:null = null
const c:string = 'hi'
const d:boolean = true
cosnt e:symbol = Syombol('hi')
const f:bigint = 123n
//以上七种简单的数据类型都是支持的
//object同样支持，只是有些需要注意的点
const obj:Object = {} //Object是类
cosnt obj2:object = {} //object是数据类型
//推荐类，因为类更明确
const arr:Array<string|number|null>= ['1','2',3,null]//数组类型也可以规定
```
```
//函数
//1.类型写在函数体
const add = (a:number,b:number):number => a + b //规定a,b都是number，返回值也是number
//2.类型写在:后面
const add2:(a:number,b:number) => number = (a,b) => a + b
```
对于函数来说类型声明过于冗杂，所以实际开发中这两种都不怎么用。这就诞生了新的ts语法。

```
//3.type缩写
type Add = (a:number,b:number) => number //类型声明
const add:Add = (a,b) => a + b
```
我们知道函数也是对象，如果我们想实`add.xxx ='yyy'`之类的功能，`type`就不够用了。这时我们需要使用`interface`关键字。

```
//4.有属性只能用interface
interface AddWithProps{
//先写类型
  (a:number,b:number) : number
  xxx.string
  //这样我们就声明了一个函数并且有属性
}
const add2:AddwithProps = (a,b) => a + b
add2.xxx = 'yyy'
```
3. TypeScript独有的类型

**any**

类型是any的变量可以随便改变自己的类型。
```
let a:any = 'hi'
a = 1
```

**unknown**

unknown一般不是自己写的，是从外部获取的。比如JSON.parse通过AJAX获取的。

注意：unknown类型的变量要使用时必须**断言**，即明确它的类型。
```
type B = {name:string}
let b = unknown = JSON.parse('{"name":"Origami"}')
console.log((b as B).name) //需要断言 
```

**void**

void用来描述函数,是无返回类型。

```
let print:() => void = function(){
  console.log(1)
}
print()
```

**never**

下列代码中规定了dir可以为1，2，3，4或者undefined，如果不在这个集合中那么就是never。
never表示不应该存在，没有类型。

```
type Dir = 1 | 2 | 3 | 4 | undefined
let dir:Dir

switch(dir){
  case 1:
     break;
  case 2:
     break;
  case 3:
     break;
  case 4:
     break;  
  case undefined:
     break;
  default:
     console.log(dir) //never
     break;
}
```

或者两个集合的交集为空，那么也是never。

```
type X = number & string //X为never
```
一般出现never，就代表代码可能出错了。

**tuple**

tuple——元组

假设我们需要个一个坐标p（100,200），如果我们把类型规定为数组，会出现问题。

```
let p: Array<number> = [100,200]
p = [1,2,3,4] //合法，但显然不是我们想要的。我们需要规定它的长度
```

这种需要规定长度，我们可以使用元祖。

```
let p:[number,number] = [100,200]
let p2:[number,string] = [100,'x']
let p3:[number,string,boolean] = [100,'x',true]
```

**enum**

enum——枚举

```
enum Dir{东,南,西,北}
let d:Dir = Dir.东 //0
let d2:DIr = Dir.西
console.log(d)
```
很难用，一般还是写成这样:

```
type Dir = '东' | '南' | '西' | '北'
let dir:Dir = '东'
```


### Typescript中type的用法

