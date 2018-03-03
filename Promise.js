function Promise(fn){
  var callbacks = [],
      value,
      state = 'pending';
  
  //添加state, 当state为pending时, 将其添加到队列中, 若不为说明这时Promise已经执行完, 直接执行回调函数
  this.then = function(onFulfilled){
    if(state === 'pending'){
      callbacks.push(onFulfilled);
      return
    }
    
    onFulfilled(value);
  }
  
  function resolve(newValue){
    value = newValue
    state = 'fulfilled';
    
    //利用setTimeout将callbacks的执行添加到消息队列中, 这样当他执行时保证then已执行完
    setTimeout(function(){
      callbacks.forEach(function(onFulfilled){
        //通过给value赋值, 可以将前一个callback的返回值赋给下一个callback
        value = onFulfilled(value)
      })
    }, 0)
  }
  
  fn(resolve)
}