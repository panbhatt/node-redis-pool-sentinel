node-redis-pool-sentinel
===============

### Install

    npm install pool-redis-sentinel

## Introduction

This is lightweight node.js module for using redis connections via pool which are automatically reconnected (once disconnected due to unavailability of the server) via the help of redis Sentinels.
This module require and based on [node_redis][]

Here is an example on how to use it:

```js

 var sentinalDetails = [ { 'host': '192.168.191.128', port: 26379}, {host: '192.168.191.203', port: 26379} ] ;
 var poolRedis = require('pool-redis-sentinel')({  sentinels : sentinalDetails, 
                                masterName : 'mymaster',
                                'maxConnections': 10,
                                'opts':{}
                             }); 

poolRedis.getClient(function(client, done) {
  client.get('key', function(err, value) {
    console.log('value from redis is:', value);
    done();
  });
});
```

## Redis pool options

* `sentinels`: An Array that contains the list of all the sentinels with the host and port.
* `opts`: The additional redis connection options. [See more][] (Default: `{}`). It is same as being provided by the node-redis library which can include password and other details.
* `maxConnections`: The max connections count to redis. All next active connections will waiting for connection release. So, don't forget to release connections after using. (Default: `10`)
* `handleRedisError`: If enable - all redis exceptions will be handled, using console.error. (Default: `false`)

[See more]: https://github.com/mranney/node_redis#rediscreateclientport-host-options

## Methods

### getClient(callback)
Main method. Returns a redis client from the pool. The callback is passed an **client** and **done**. The **client** object is a normal [redis client][]. Release the **client** into a pool by calling the **done()** function (simplest way) or call .release(client) method.

### release(client)
This method will release client object back into the pool.

### close(client)
This method will close client object and remove it from pool.

### closeAll()
This method will close all redis clients, what is in pool now. Make sure, what all redis operations are completed, before call this method.

[redis client]: https://github.com/mranney/node_redis#usage

## LICENSE - "MIT License"


Copyright (c) 2015 Pankaj Bhatt (panbhatt@gmail.com) inspired by redis-pool by (valzon@rambler.ru) avaiable at https://github.com/Valzon/node-redis-pool 

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
