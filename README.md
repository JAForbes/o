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
