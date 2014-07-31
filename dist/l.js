function l (list,changeCallback) {
	var rootCallbacks = [];

	var entry = function l(index,value){
		if(arguments.length != 0){
			return list.apply(null,arguments)
		}
		return list();
	}

	/*
		Accept change handlers on the root object
	*/
	entry.change = function(onchange){
		rootCallbacks.push(onchange)
		return entry;
	}


	list = (function(original){

		function getAll(){
			return toJSON(original,[])
		}

		function getVal(index){
			return original[index]
		}

		function set(index,value){
			var hasChanged = value != original[index]
			original[index] = value;

			return hasChanged && changed(index,value) || entry
		}

		function list(index,value){
			var response;
			var nArgs = arguments.length;
			if(nArgs == 2){
				response = set(index,value)
			} else if (nArgs == 1){
				response = getVal(index)
			} else {
				response = getAll()
			}

			return response;
		}

		return list
	})(list || [])


	function changed(val,key){
		var fire = function(callback){
			callback(val,key,list())
		}
		each(rootCallbacks,fire)
		return entry;
	}


	function toJSON(obj,json){
		json = json || {}
		each(obj,function(val,key){
			json[key] = val
		})
		return json;
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

	//returns "Array", "Number", "Object", "Function", "Null", "Undefined"
	function type(o){
		return ({}).toString.call(o).slice(8,-1)
	}


	return entry
}

/*

l([1,2,3])

l(0) //returns 1

l(0,'a')() //returns ['a',2,3]

l(-1) //returns 3

*/