### TS和JS有什么区别

1. 语法层面：TypeScript = JavaScript + Type （TS是JS的超集）
2. 执行环境层面：浏览器、Node.js可以直接执行JS，但不能执行TS。
3. 编译层面：TS有编译阶段，JS没有编译阶段（只有转译阶段和lint阶段）
4. 编写层面：TS更难写一点，但是类型相对安全。
5. 文档层面：TS的代码写出来就是文档，IDE可以完美提示。JS的提示主要靠TS。


### any、unknown、never的区别

##### any vs unknown

二者都是**顶级类型**，任何类型的值都可以赋值给顶级类型变量

```
let foo:any = 123 //不报错
let bar:unknown = 123 //不报错
```
但是`unknown`比`any`的类型检查更严格，`any`什么检查都不做，`unknown`要求先收窄类型。

```
const value:unknown = "Hello World"
const someString:string = value
//报错：Type'unknown' is not assignable to type 'string'.
```

把顶级类型变量的值赋值给低级类型变量就会报错。

收窄类型后不报错

```
const value:unknown = "Hello World"
const someString:string = value as string //不报错
```

如果改成any，基本都不会报错。所以能用unknown就优先用unknown，类型会更加安全。


##### never

`never`是底类型，表示不应该出现的类型。


```
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
    switch (val.type) {
        case 'foo':
            // 这里 val 被收窄为 Foo
            break
        case 'bar':
            // val 在这里是 Bar
            break
        default:
            // val 在这里是 never
            const exhaustiveCheck: never = val
            break
    }
}

```

### type 和 interface的区别是什么

1. 组合方式：interface使用extends来实现继承，type使用&来实现联合类型
2. 扩展方式：interface可以重复声明用来扩展，type一个类型只能声明一次。
3. 范围不同：type适用于基本类型，interface一般不行。
4. 命名方式：interface会创建新的类型名，type只是创建类型别名，没有新创建类型。

### TS工具类型的作用和实现

1. 将英文翻译成中文


a. Partial 部分类型

b. Required 必填类型

c. Readonly 只读类型

d. Exclued 排除类型

e. Extract 提取类型

f. Omit 排除key类型

g. ReturnType 返回值类型

h. Pick 获取类型

2. 举例说明每个工具类型的用法


**Partial**

```
interface User{
   id: string;
   name: string
}
const user:Partical<User> = {
   name: 'Origami'
   //id 上传到服务器才有，所以使用Partial可以使用User的一部分
}
```

**Required**

```
interface User{
   id?: string;
   name: string
}
const user:Required<User> = {
   name: 'Origami',
   id: '111',
   //name和id必须都有。可以理解为Partial的反操作
}
```

**Readonly**

```
interface User{
   id: string;
   name: string
}
const user:Readonly<User> = {
   name: 'Origami',
   id: '111',
}
user.id = '222' //报错，因为Readonly会把key变成只读的
```

**Pick**

```
interface User {
   id: string;
   name: string;
   age: number;
}

interface God1 {
   id: string;
   name:string;
}

type God2 = Pick<User,'id' | 'name'> //God2等价于God1
 
```

**Omit**

理解为`Pick`的反向操作。

```
interface User {
   id: string;
   name: string;
   age: number;
}

interface God1 {
   id: string;
   name:string;
}

type God2 = Omit<User,'age'> //God2等价于God1
```

**Exclude**

```
type Dir = '东' | '南' | '西' | '北'

type Dir2 = Exclude<Dir,'北'> //Dir2 = '东' | '南' | '西' 

```

**Extract**

```
type Dir = '东' | '南' | '西' | '北'

type Dir2 = Extract<Dir,'北' | '南'> //Dir2 = '北' | '南'
```
`Extract`是`Exclude`的反操作。