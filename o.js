//Author: James Forbes - 2014 - MIT Licence
function o(hash,changeCallback){

	var callbacks = {};

		/*
		close over hash, and replace with hash()
		Only remove() and hash() can mutate hash.
		Other functions have to go through hash()
	*/
	(function(original){

		hash = function(key,val){
			if(arguments.length == 2){
				if(!val){
					delete original[key]
				} else {
					original[key] = val	
				}
				return changed(val,key);
			} else if (key) {
				return original[key]
			} else {
				return copy(original)
			}
		}

	})(hash || {})



	//route queries to setters//getters
	function entry(key,value){
		if(arguments.length != 0){
			return entry[key](value)
		}
		return hash();
	}

	entry.remove = function(keys){
		if(arguments.length > 1){
		  keys = ([]).slice.call(arguments);
		}
		if(Array.isArray(keys)){
			each(keys,function(key){
				entry.remove(key)
			})
		} else {
			var key = keys;
			delete hash(key,null) //delete internal state
			delete entry[key] //delete accessor function
			delete callbacks[key] //delete callback
		}
		return entry;
	}

	function changed(val,key){
		changeCallback && changeCallback(val,key,hash())
		callbacks[key] && callbacks[key](val,key,hash())
	}


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
	
		if(isArray(obj)){

			for(var i = 0; i< obj.length; i++){
				iterator(obj[i],i)
			}	
		} else {
			for(var k in obj){
				var v = obj[k];
				iterator(v,k)
			}
		}
	}

	function isArray(array){
		return !!array.concat
	}

	//creates an attribute getter/setter
	function createAccessor(key){
	  return function(val){
	  	if(typeof val != 'undefined'){
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