//Author: James Forbes - 2014 - MIT Licence
function o(hash,changeCallback){

	var callbacks = {};

	//route queries to setters//getters
	function entry(key,value){
		if(key && value){
			return set(key,value)
		} else if(key) {
			return hash[key]
		}
		return copy(hash);
	}

	//return a copy of the internal hash
	function copy(obj){
		var _copy = {};
		each(obj,function(val,key){
	      _copy[key] = val;
		});
		return _copy;
	}

	//set a val in the hash, trigger change and create a getter/setter
	function set(key,val){
  		//set value
  		hash[key] = val;
  		//call change callback
  		changeCallback && changeCallback(val,key,hash)
  		//create setter
  		entry[key] = attr(key)
  		entry[key].change = acceptAttrChange(key)
  		callbacks[key] && callbacks[key](val,key,hash)
  		return entry;
	}

	function acceptAttrChange(key){
		return function(changeCallback){
			callbacks[key] = changeCallback
		}
	}

	//iterate through an object
	function each(hash,iterator){
		for(var k in hash){
			var v = hash[k];
			iterator(v,k)
		}
	}

	//creates an attribute getter/setter
	function attr(key){
	  return function(val){
	  	if(val){
	  		return set(key,val)
	  	}
      	return hash[key]
      }
	}

	function isArray(array){
		return !!array.concat
	}

	entry.remove = function(keys){
		if(Array.isArray(keys)){
			for(var i =0; i< keys.length; i++){
				entry.remove(keys[i])
			}
		} else {
			var key = keys;
			delete hash[key]
			delete entry[key]
			changeCallback(null,key,hash)
			callbacks[key] && callbacks[key](val,key,hash)
			delete callbacks[key]
		}
		return entry;
	}

	entry.change = function(onchange){
		changeCallback = onchange
		return entry;
	}

	each(hash,function(val,key){
      set(key,val)
	});

	return entry;
}