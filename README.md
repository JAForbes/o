o
=

A functional object literal

Why?
----

Object literals are great!  They are succinct and readable.  But they have one major problem - it is hard to know when values change.

This may not be a problem if you are using a library like BackboneJS, but if you don't want the overhead - o is for you.

Quick Start?
-----

o has all the functionality of an object literal but with extra magic powers:

- Convenient concise chaining syntax
- Change handlers
- Inaccessible internal state

```javascript

life = o({
  age: 'young',
  innocence: true
})

life.change(function(val,key,hash){
  console.log('My life has changed')
})

life.age.change(function(val,key,hash){
  console.log('Happy Birthday!')
})

life
  .age('older')
  ('experiences',true)
  .remove('innocence')


life() // returns {age: 'older', experiences: true }

```


Interface
---------

####Object Creation####

Initialize o with a object literal, and an optional change callback. Returns an accessor function.

```javascript
var accessor = o(objectLiteral,[changeCallback])
```

###Object Access###

You cannot bypass the object accessors to mutate state.  This makes it impossible for a value to be changed without a change handler firing.  

However you can always access a shallow copy of it's current state as a native object.

```javascript
var accessor = o({name: 'George', personality: 'curious'})

accessor() //returns a shallow copy: {name: 'George', personality: 'curious'}

accessor().personality = 'disinterested' //this will not mutate the internal state

accessor().personality //returns 'curious'

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

```javascript
witch = o()
  ('personality','wicked')
  ('occupation','witch')
  ('province','west')
  
witch.remove('personality')

witch.remove('occupation','province')

//the above is equivalent to

witch.remove(['occupation','province'])
```

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
