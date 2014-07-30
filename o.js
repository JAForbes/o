//Author: James Forbes - 2014 - MIT Licence
function o(hash,changeCallback){

	var callbacks = {};

	//route queries to setters//getters
	function entry(key,value){
		if(key && value){
			return set(key,value)
		} else if(key) {
			return hash(key)
		}
		return hash();
	}

	/*
		close over hash, and replace with hash()
		Only remove() and hash() can mutate hash.
		Other functions have to go through hash()
	*/

	(function(original){

		entry.remove = function(keys){
			if(arguments.length > 1){
			  keys = ([]).slice.call(arguments);
			}
			if(Array.isArray(keys)){
				for(var i =0; i< keys.length; i++){
					entry.remove(keys[i])
				}
			} else {
				var key = keys;
				delete original[key]
				delete entry[key]
				changeCallback && changeCallback(null,key,hash())
				callbacks[key] && callbacks[key](val,key,hash())
				delete callbacks[key]
			}
			return entry;
		}


		hash = function(key,val){
			if(key && val){
				return original[key] = val
			} else if (key) {
				return original[key]
			} else {
				return copy(original)
			}
		}

	})(hash || {})



	//return a copy of a hash
	function copy(obj){
		var copied = {};
		each(obj,function(val,key){
			copied[key] = val;
		});
		return copied;
	}

	//set a val in the hash, trigger change and create a getter/setter
	function set(key,val){
  		//set value
  		hash(key,val)
  		//call change callback
  		changeCallback && changeCallback(val,key,hash())
  		//create setter
  		entry[key] = createAccessor(key)
  		entry[key].change = acceptAttrChange(key)
  		callbacks[key] && callbacks[key](val,key,hash())
  		return entry;
	}

	function acceptAttrChange(key){
		return function(changeCallback){
			callbacks[key] = changeCallback
		}
	}

	//iterate through an object
	function each(obj,iterator){
		for(var k in obj){
			var v = obj[k];
			iterator(v,k)
		}
	}

	function isArray(array){
		return !!array.concat
	}

	//creates an attribute getter/setter
	function createAccessor(key){
	  return function(val){
	  	if(val){
	  		return set(key,val)
	  	}
      	return hash(key)
      }
	}

	entry.change = function(onchange){
		changeCallback = onchange
		return entry;
	}
	
	each(hash(),function(val,key){
      set(key,val)
	});

	return entry;
}