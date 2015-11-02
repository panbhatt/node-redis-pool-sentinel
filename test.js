var RedisPool = require('./index');
var assert = require('assert');

var sentinalDetails = [ { 'host': '192.168.191.128', port: 26379}, {host: '192.168.191.203', port: 26379} ] ;

function testRedisConn(cb) {
  var pool = new RedisPool({  sentinels : sentinalDetails, masterName : 'mymaster' });
  pool.getClient(function(rc, done) {
    assert.equal(pool._connections.all.length, 1);
    assert.equal(pool._connections.free.length, 0);
    pool.close(rc);
    cb();
  });
};

function testFree(cb) {
    var pool = new RedisPool({  sentinels : sentinalDetails, masterName : 'mymaster' });
  pool.getClient(function(rc, done) {
    assert.equal(pool._connections.free.length, 0);
    done();
    assert.equal(pool._connections.free.length, 1);
    pool.close(rc);
    cb();
  });
};

function testPoolAndCloseAll(cb) {
  var pool = new RedisPool({  sentinels : sentinalDetails, masterName : 'mymaster' });    
  var totalCnt = pool._config.maxConnections, completeCnt = 0;
  var check = function() {
    assert.equal(pool._connections.free.length, 0);
    assert.equal(pool._connections.all.length, totalCnt);
    pool.closeAll();
    assert.equal(pool._connections.all.length, 0);
    cb();
  }
  for (var i = 0; i<totalCnt; i++) {
    pool.getClient(function(rc, done) {
      if (++completeCnt == totalCnt) {
        check();
      }
    })
  }
};

function testQueue(cb) {
  var pool = new RedisPool({  sentinels : sentinalDetails, masterName : 'mymaster' });    
  var totalCnt = pool._config.maxConnections + 5, completeCnt = 0, closed = 0;
  var check = function() {
    assert.equal(pool._connections.free.length, 0);
    assert.equal(pool._connections.all.length, pool._config.maxConnections);
    assert.equal(pool._queue, 0);
    pool.closeAll();
    cb();
  }
  for (var i = 0; i<totalCnt; i++) {
    pool.getClient(function(rc, done) {
      setTimeout(function() {
        assert.equal(pool._queue.length, (5-closed > 0 ? 5-closed : 0));
        done();
        closed++;
        assert.equal(pool._queue.length, (5-closed > 0 ? 5-closed : 0));
      }, 3000);
      if (++completeCnt == totalCnt) {
        check();
      }
    })
  }
};

//Make sure you keep on changing your master server in while the test is running.
function testReconnection(cb){
    var pool = new RedisPool({  sentinels : sentinalDetails, 
                                masterName : 'mymaster',
                                'maxConnections': 10,
                                'opts':{}
                             });    
    pool.getClient(function(rc,done){
            var i = 0; 
            rc.set('TestValue',new Date());
        // Periodically checking the console to for Reconnecting
         setInterval(function(){
             
             rc.get('TestValue',function(err,val) {
                    console.log(i , " = Value = " + val);
              });
             i++;
                 if(i > 15) {

                     done();
                     cb();
                     process.exit();
                 }
                 
            },10000);
        
    });
    
   
};

/*
testRedisConn(function() {
  testFree(function() {
    testPoolAndCloseAll(function() {
      testQueue(function() {
        testReconnection(function() {
            console.log('All tests complete');
            process.exit();
        });
      });
    })
  })
}); 
*/

//testRedisConn(function(){console.log("Done"); process.exit(); } );
//testFree(function(){console.log("Done"); process.exit(); } );
//testPoolAndCloseAll(function(){console.log("Done"); process.exit(); } );
//testQueue(function(){console.log("Done"); process.exit(); } );
testReconnection(function(){console.log("Done");  } );
