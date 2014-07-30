o
=

A functional object literal

Why?
----

Object literals are great!  They are succinct and readable.  But they have one major problem - it is hard to know when values change.

This may not be a problem if you are using a library like BackboneJS, but if you don't want the overhead - o is for you.

What?
-----

o has all the functionality of an object literal but with extra magic powers.

```javascript

person = o({
  first: 'James',
  last: 'Forbes'
})

person() //returns a shallow copy of person { first: 'James', last: 'Forbes' }

person.first() //returns 'James'

person.last('Black') //sets person.last to 'Black'

//callback function when a change occurs
person.change(function(val,key,hash){
  console.log('I feel good!')
})

//callback functions for individual attributes
person.first.change(function(val,key,hash){
  console.log('My first name changed to',val)
})

//add a record
person('middle','Anthony')

person.middle() //returns 'Anthony'

person('middle') //returns 'Anthony' too!

person.remove('middle') //deletes the record and the accessor function

person.remove(['middle','last']) //accepts multiple keys

//You can chain too
person
  .first('James')
  .middle('Anthony')
  .last('Forbes')
()

```


Interface
---------

####Object Creation####

Initialize o with a object literal, and an optional change callback. Returns an accessor function.

```javascript
var accessor = o(objectLiteral,[changeCallback])
```

###Object Access###

o's cannot be mutated non-functionally.  But you can always access a shallow copy of it's current state.

```javascript
var accessor = o({name: 'Oscar', animal: 'giraffe'})

accessor() //rteturns a shallow copy: {name: 'Oscar', animal: 'giraffe'}

accessor().animal = 'Parrot' //this will not mutate the internal state

accessor().animal //returns 'giraffe'

```

###Attribute getters/setters###

o has two get/set syntaxes.  `accessor.attribute([val])` or `accessor('attribute',[val])`.  o automatically creates and removes accessor functions for attributes during the lifecycle of the object.

```javascript

var greatescape = o({name: 'harry', type: 'tunnel'})

//getter setters are automatically created!

greatescape.name() //returns 'harry'

greatescape.name('tom') //sets harry's name to 'tom'

//optional syntax for getting / setting is equivalent
greatescape('name') //returns 'tom'

greatescape('name','dick') //sets name to dick

```

###Removing records###

The remove function is accessible from the root accessor.  It accepts variable arguments or an array.

witch = o()
  ('personality','wicked')
  ('occupation','witch')
  ('province','west')
  
witch.remove('personality')

witch.remove('occupation','province')

// which is equivalent to
witch.remove(['occupation','province'])

###Function Chaining###

Every function returns a reference to the root accessor function.  This allows you to chain multiple commands
concisely.

```javascript

person = o()
  ('first','Clark')
  ('occupation','Journalist')
  ('last','Kent')
  
  
person
  .first('Superman')
  .remove('last')
  .occupation(person.first())
  
```

###Change handlers###

You can attach change callbacks to the root accessor `accessor.change(callback)` or attribute accessors`accessor.attr.change(callback)`.  You will be notified whenever the selected scope changes.

```javascript

alice = o()
  ('location','wonderland')
  ('head','attached')
  .change(function(val,key,hash){
    console.log('My ',key,' has changed to',val)
  })
  .head.change(function(val,key,hash){
    console.log('My head has changed to',val)
  })
  .location('The Queen\'s Court') //triggers only the root change callback
  .remove('head') //triggers the head change and the change callback

```

You can also attach a change handler on initialization as a second argument.

```javascript

bobDylan = o({times:'stagnant'},function(val,key,hash){
  console.log('The times they are a changing!')
})

```
