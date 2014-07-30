//Author: James Forbes - 2014 - MIT Licence
function o(hash,changeCallback){

	var callbacks = {};
	var accessors = {};

	var t =  {
		intro: 'You will not be able to use the automatic function syntax e.g. o.____() to access a record with the key "____".',
		reasons: {
			existingFunction: 'There is already a ____() function, and o wouldn\'t know your intentions.',
			nameReadOnly: 'The accessor is a function and you cannot override function.name in Javascript.',
		},
		disadvantages: {
			nameReadOnly: 'Be aware, you will not be able to use a change listener for this attribute, as '+
			  'the name property is a string, and strings cannot have custom properties in Javascript'
		},
		reassurance: 'Feel free to use the query syntax e.g. o("____") though!',
		pattern: /____/g
	}
	var warnings = {
		name: [t.intro,t.reasons.nameReadOnly,t.reassurance,t.disadvantages.nameReadOnly],
		remove: [t.intro,t.reasons.existingFunction,t.reassurance],
		change: [t.intro,t.reasons.existingFunction,t.reassurance]
	}
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
			return hash(key,value)
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
				var valtype = type(val);
				var hasChanged = val != original[key]

				if(/Undefined|Null/.test(valtype)){
					
					delete original[key]
					delete accessors[key]
					if(entry[key]){ delete entry[key].change }

				} else {
					
					original[key] = val
					accessors[key] = accessors[key] || createAccessor(key)
				}
				return hasChanged && changed(val,key) || entry;
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

	function type(o){
		return ({}).toString.call(o).slice(8,-1)
	}

	//creates an attribute getter/setter
	function createAccessor(key){
		var accessor = function(val){
			if(type(val) != 'Undefined'){
				return set(key,val)
			}
			return hash(key)
		}
		automaticFunctionGen(key,accessor)
		return accessor;
	}

	function automaticFunctionGen(key,accessor){

		if(!(key in warnings)){ 
			entry[key] = accessor
			entry[key].change = acceptAttrChange(key)
		} else {
			warn(key)
		}
	}

	function warn(key){
		var warning = warnings[key]
			.join('\n\n')
			.replace(t.pattern,key)
		console.warn(warning)
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