function Promise(fn){
  var callbacks = [],
      value,
      state = 'pending';
  
  this.then = function(onFulfilled, onRejected){
    return new Promise(function(resolve, reject){
        handle({
            onFulfilled = null,
            onRejected = null,
            resolve,
            reject
        })
    })
  }
  
  function handle(callback){
    if(state === 'pending'){
        callbacks.push(callback);
        return 
    }
    
    let cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
        ret;
    
    if(cb === null){
        cb = state === 'fulfilled' ? callback.resolve : callback.reject;
        cb(value);
        return
    }
    
    //执行成功回调或失败回调时出错将其捕获
    try{
        ret = cb(value);
        callback.resolve(ret);
    }catch(e){
        callback.reject(e)
    }
  }
  
  function resolve(newValue){
    if(newValue && (typeof newValue === 'object' || typeof newValue === 'function')){
        var then = newValue.then;
        if(typeof then === 'function'){
            then.call(newValue, resolve, reject);
            return;
        }
    }
    
    value = newValue
    state = 'fulfilled';
    
    setTimeout(function(){
      callbacks.forEach(function(callback){
        handle(callback);
      })
    }, 0)
  }

  function reject(newValue){
    value = newValue;
    state = 'rejected';

    setTimeout(function(){
      callbacks.forEach(function(callback){
        handle(callback);
      })
    }, 0)
  }
  
  fn(resolve, reject);
}
