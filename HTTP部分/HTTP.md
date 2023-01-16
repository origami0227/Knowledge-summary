### 总览

1. GET 和 POST 的区别是什么？
2. HTTP 缓存有哪些方案？
3. HTTP 和 HTTPS 的区别有哪些？
4. HTTP/1.1 和 HTTP/2 的区别有哪些？
5. TCP 三次握手和四次挥手是什么？
6. 说说同源策略和跨域
7. Session、Cookie、LocalStorage、SessionStorage 的区别

##### GET 和 POST 的区别是什么？

**区别一：幂等性**

注：*幂等性*就是如果操作重复很多遍但不改变结果那么就是幂等的

1. 由于GET是读，POST是写，所以GET是幂等的，POST不是幂等的。
2. 由于GET是读，POST是写，所以用浏览器打开放野会发送GET请求，想要POST打开网页要用form标签。
3. 由于GET是读，POST是写，，所以GET打开的页面刷新是无害的，POST打开的页面刷新需要确认。
4. 由于GET是读，POST是写，所以GET结果会被缓存，POST结果不会被缓存。
5. 由于GET是读，POST是写，所以GET打开的界面可以被书签收藏，POST打开的不行。

**区别二：请求参数**

1. 通常，GET请求参数放在url里，POST请求数据放在body（消息体）里。（不成文规定）
2.  GET比POST更不安全，因为参数直接暴露在url上，所以不能用来传递敏感信息。
3.  GET请求参数放在url里面是有长度限制的（实际上是浏览器和服务器为了方便而限制），而POST放在body里面没有长度限制。

**区别三：TCP packet**

1. GET产生一个TCP数据包；POST产生两个或以上数据包。

##### HTTP缓存有哪些方案


|             | 缓存（强缓存） | 内容协商（弱缓存）     |
| :---        | :----       | :---          |
| HTTP 1.1    | Cache-Control:  max-age=3600</br>Etag:ABC     | If-None-Match:ABC</br>响应状态码：304或200   |
| HTTP 1.0    | Expires:Wed,21 Oct 2015 02:30:00 GMT</br>Last-Modifiled:Wed,21 Oct 2015 01:00:00 GMT        | If-Modifiled-Since:Wed,21 Oct 2015 01:00:00 GMT</br>响应状态码：304或200      |


**HTTP1.1**中`Cache-Control:  max-age=3600`意义为在请求头中写上这句就会自动缓存一个小时，期间只要访问了本url就不发请求。
`Etag`是第一次访问时服务器给的特征值，在缓存过期后来问服务器能不能删除。强缓存后转为内容协商对特征值进行匹配。


**HTTP1.0（几乎不用）中**  `Expires`是过期时间，`Last-Modifiled`为上次修改时间。过期后转为内容协商对上次修改时间进行匹配。

##### HTTP和HTTPS的区别

HTTPS = HTTP + SSL/TLS（安全层）

1. HTTP是明文传输的，不安全；HTTPS是加密传输的，非常安全
2. HTTP使用80端口，HTTPS使用443端口
3. HTTP较快，HTTPS较慢
4. HTTPS的证书一般需要购买，HTTPS不需要证书。

##### TCP三次握手和四次挥手

TCP就是传输内容协议。

**建立TCP连接时server与client会经历三次握手**

1. 浏览器向服务器发送TCP数据：SYN(seq=x)
2. 服务器向浏览器发送TCP数据：ACK(seq=x+1)SYN(y)
3. 浏览器向服务器发送TCP数据：ACK(seq=y+1)

图解：

（SYN——同步信息；ACK——知道）
![截屏2023-01-14 16.07.37.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14e66ea297ef4053a720926c8b0659c6~tplv-k3u1fbpfcp-watermark.image?)

**关闭TCP连接时server与client会经历四次挥手**


1. 浏览器向服务器发送TCP数据：FIN(seq=x)
2. 服务器向浏览器发送TCP数据：ACK(seq=x+1)
3. 服务器向浏览器发送TCP数据：FIN(seq=y)
4. 浏览器向服务器发送TCP数据：ACK(seq=y+1)

*注意：2，3步骤之前服务器很可能还有数据要发送。不能提前发送FIN*
（FIN——完成；ACK——知道）
图解：

![截屏2023-01-14 16.11.28.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80d93346a3644a618b248b43a8a979f9~tplv-k3u1fbpfcp-watermark.image?)

##### 同源策略和跨域

###### 同源策略是什么

如果两个URL的协议、端口和域名完全一致，则这两个URL是同源的

###### 谈谈同源策略怎么做

只要在浏览器里打开页面，就默认遵守同源策略

###### 优点

保证用户的隐私安全和数据安全

###### 缺点

很多时候前端需要访问另一个域名的后端接口，会被浏览器阻止其获取响应。

比如甲站通过AJAX访问乙站点的/money查询余额接口，请求会发出，但是响应会被浏览器屏蔽。

###### 怎么解决缺点

**使用跨域手段**

1. JSONP

#### 什么是JSONP呢？

我们在跨域的时候，由于当前浏览器不支持CORS，或者因为某些条件不支持CORS，我们必须使用一种方法来进行跨域。于是我们请求一个JS文件，这个JS文件会执行一个回调，回调里面有我们的数据。 *这个回调的名字是什么？* 回调的名字可以通过随机数生成的，我们把这个随机数以callback的参数传给后台，后台会把函数返回给我们并且执行

a. 甲站点利用script标签可以跨域的特性，向乙站点发送get请求

b. 乙站点后端改造JS文件的内容，将数据传进回调函数

c. 甲站点通过毁掉函数拿到乙站点的数据
**优点**：改动比较小。

**缺点**：由于它是一个script标签，所以读不到AJAX那么精确的status值，无法知道状态码是什么，也只能发送GET请求，JSONP不支持POST。并且不支持用户认证

2. CORS


a. 对于简单请求，乙站点在相应头里添加`Access-Control-Allow-Origin:http://甲站点`即可。

b. 对于复杂请求，如PATCH，乙站点需要：

      i. 响应OPTIONS请求，在响应中添加如下响应头
      ```
      Access-Control-Allow-Origin:http://甲站点
      Access-Control-Allow-Methods:POST,GET,OPTIONS,PATCH
      Access-Control-Allow-Headers:Content-Type
      ```
      
      ii. 响应POST请求，在相应中添加`Access-Control-Allow-Origin`头
    
    c. 如果需要附带身份信息，JS中需要在AJAX里设置`xhr.withCredentials = true`。
    
    >CORS（Cross-origin resource sharing） “跨域资源共享” 跨源资源共享CORS（或通俗地译为跨域资源共享）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其它 origin（域，协议和端口），使得浏览器允许这些 origin 访问加载自己的资源。 

3. Nginx代理/Node.js代理
   a. 前端 => 后端 => 另一个域名的后端

##### Session、Cookie、LocalStorage、SessionStorage的区别

**Cookie V.S. LocalStorage**

1. 主要区别是Cookie会被发送到服务器，而LocalStorage不会
2. Cookie一般最大4k，LocalStorage根据浏览器的不同可以用5Mb甚至10Mb

**LocalStorage V.S. SessionStorage**

1. LocalStorage一般不会自动过期（除非用户手动清除）
2. SessionStorage在页面会话结束时过期（比如关闭浏览器，具体由浏览器自行决定）

**Cookie V.S. Session**

1. Cookie存在浏览器的文件里，Session存在服务器的文件里
2. Session是基于Cookie实现的，具体做法就是把SessionID存在Cookie里

##### HTTP 1 和HTTP 2的区别

1. HTTP/2使用了二进制传输，而且将head和body分成帧来传输；HTTP/1.1是字符串传输。
2. HTTP/2支持多路复用，HTTP/1.1不支持。**多路复用**简单来说就是一个TCP连接从单车道变成了几百个双向通行的车道。
3. HTTP/2可以压缩header，但是HTTP/1.1不行。
4. HTTP/2支持服务器推送，但是HTTP/1.1不支持。

