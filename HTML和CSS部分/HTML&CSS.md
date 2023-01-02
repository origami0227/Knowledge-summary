### HTML部分

##### 语义化标签

回答方法：
1. 是什么：语义化标签是一种写HTML标签的方法论。
2. 怎么做：实现方法是遇到标题就用h1到h6，遇到段落用p，遇到文章用article，主要内容用main，侧边栏用aside，导航用nav等。（中文对应的英文）
3. 解决了什么问题：明确了HTML的书写规范
4. 优点：适合搜索引擎搜索；适合人类阅读且便于团队维护。
5. 缺点：没有
6. 怎么解决缺点：无需解决。

概念题答题技巧：「是什么，怎么做，解决了什么问题，优点，缺点，怎么解决缺点」

##### HTML5 有哪些新的标签

文章相关：header、main、footer、nav、section、article
多媒体相关：video、audio、svg、canvas
表单相关：type=email、type=tel

**不要提不熟悉的标签**


##### Canvas和SVG的区别

区别题答题：先说一再说二，然后说相同点，最后说不同点。

1. Canvas主要是用**笔刷**来绘制2D图形的
2. SVG主要是用**标签**来绘制不规则矢量图的
3. 相同点：主要都是用来绘制2D图形的
4. **不同点：Canvas画的是位图，SVG画的是矢量图；SVG节点过多时渲染慢，Canvas性能更好一些，但是写起来会复杂；SVG支持分层和事件，Canvas不支持，但是可以用库实现。**

### CSS部分

##### BFC是什么

1. 是什么：块级格式化上下文
2. 怎么做：列举一些BFC触发条件
* 浮动元素（float不是none）
* 绝对定位元素（position为absolute或者fixed）
* 行内块元素（inline block）
* overflow不为visible的块元素
* 弹性元素（display为flex或inline-flex元素的直接子元素）
3. 解决了什么问题：清除浮动；防止margin合并；某些古老的布局方式会用到。
4. 缺点：有副作用
5. 如何解决缺点：使用`display:flow-root`来出发BFC就没有副作用了


##### 如何实现垂直居中

**七种方法**

1. 使用table标签，table固定高度
2. 使用div来模拟table标签
   假设有如下html，
   ![截屏2022-12-28 13.23.40.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2cf0ac3a8394a21af1f8047c29ca614~tplv-k3u1fbpfcp-watermark.image?)
   给div添加一些css即可
   让最外层的div添加display：table；在内部的td的display变成table-cell（让元素变成td）并且设置vertical-align：middle即可。
   ![截屏2022-12-28 13.24.08.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c532cc2abf01425484109783206f8516~tplv-k3u1fbpfcp-watermark.image?)

**1，2种方法属于类似的使用table自带的功能实现垂直居中**

3. 100%高度的after before加上inline block

如下html
![截屏2022-12-28 13.30.04.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a9853433544bd2a35e0a16db92328e~tplv-k3u1fbpfcp-watermark.image?)
parent有三个children分别是before，child以及after。
要想实现child垂直居中，则让child设置固定高度，并且display设置为inline block，让before和after高度设置为100%，display也设置为inline-block。三个children都设置vertical-align：middle。

![截屏2022-12-28 13.32.43.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84a69f11781b404485f2b13b658e8cc1~tplv-k3u1fbpfcp-watermark.image?)

4. margin-top -50%

两个父子关系元素，父元素设置相对定位，子元素绝对定位。宽高各50%，marigin-left设置为负的宽度的一半，margin-top设置为负的高度的一半。

![截屏2022-12-28 13.41.39.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8b2e67ec88541ba8638087b64b928a2~tplv-k3u1fbpfcp-watermark.image?)

5. translate -50%

同样的两个父子关系的元素，父元素设置相对定位，子元素绝对定位。宽高各50%，使用translate。

![截屏2022-12-28 13.43.10.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41246a60086444dabedbe77bb4a20307~tplv-k3u1fbpfcp-watermark.image?)

6. absolute margin auto

较为常见，

![截屏2022-12-28 13.44.11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4d896bb3da47b994b347dffcd1e23c~tplv-k3u1fbpfcp-watermark.image?)

7. 最常用的：flex布局


![截屏2022-12-28 13.44.37.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0e287565b343ae8ed7cc1ca5e70633~tplv-k3u1fbpfcp-watermark.image?)

##### CSS选择器优先级如何确定

一个选择器的特殊性是根据下列（规则）计算的：

-   如果声明来自一个'style'属性而不是一条选择器样式规则，算1，否则就是0 (= a)（HTMl中，一个元素的"style"属性值是样式表规则，这些属性没有选择器，所以a=1，b=0，c=0，d=0）
-   计算选择器中ID属性的数量 (= b)
-   计算选择器中其它属性和伪类的数量 (= c)
-   计算选择器中元素名和伪元素的数量 (= d)

一些例子：
```
 *             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
 li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
 li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
 h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
 ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
 li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
 #x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
 style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
```

简单记忆：
1. 选择器越具体，优先级越高
2. 相同优先级，出现在后面的会覆盖前面的
3. 属性后面加！important的优先级最高。（但是要少用）

##### 如何清除浮动

方法一： 给父元素加上.clearfix
```
.clearfix:after{
   content:'';
   display:block; /*或者table*/
   clear:both;
}
.clearfix{
   zoom:1; /*IE 兼容*/
}
```
方法二：给父元素加上`overflow：hidden`，即添加BFC


##### 两种盒模型的区别

第一种：content-box，width指定的是content区域宽度并不是实际宽度
公式为： 实际宽度 = width + padding + border

第二种：border-box，width指定的是左右边框外侧的距离，
公式为： 实际宽度 = width

相同点都是用来制定宽度的，不同点是border-box更好用