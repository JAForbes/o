//Author: James Forbes - 2014 - MIT Licence
function o(hash,changeCallback){

	var callbacks = {};

	/*
		TODO

		- Blacklist, no automatic function accessor for certain keys, have to use o('attr') syntax as opposed to
		o.attr() syntax 
		{
			name: can't be used because of function.name is immutable,
			remove: can't be used because it is already a method
			change: ""
		}

		- Multiple change handlers
	*/

	//route queries to setters//getters
	var entry = function (key,value){
		if(arguments.length != 0){
			return entry[key](value)
		}
		return hash();
	}

	/*
		close over hash, and replace with hash()
		Only hash() can mutate hash.
		Other functions (internal/external) have to go through hash()
	*/
	hash = (function(original){

		return function(key,val){
			if(arguments.length == 2){
				if(typeof val == undefined){
					delete original[key]
					delete entry[key].change
				} else {
					
					original[key] = val
					entry[key] = createAccessor(key)
					entry[key].change = acceptAttrChange(key)
				}
				return changed(val,key);
			} else if (key) {
				return original[key]
			} else {
				return copy(original)
			}
		}

	})(hash || {})

	entry.remove = function(keys){
		//Handle varargs and array as arguments
		if(arguments.length > 1){
		  keys = ([]).slice.call(arguments);
		}
		if(Array.isArray(keys)){
			each(keys,function(key){
				entry.remove(key)
			})
		} else {
			var key = keys;
			hash(key,null) //delete internal state
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
  		//create setter
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