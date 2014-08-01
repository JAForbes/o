describe("The Functional Object Literal", function() {
  var player;
  var song;

  it("initialization accepts an object literal with a functioning change handler", function() {

    var called = 0;
    life = o(

    { 
      age: 'young', 
      innocence: true
    },

    function(val,key,hash){
      called++;
    }
    )
    .age('older')

    expect(life().age).toEqual('older');
    expect(life('innocence')).toEqual(true);
  });

  it("internal object can not be manipulated externally", function(){
    var accessor = o({name: 'George', personality: 'curious'})

    accessor() //returns a shallow copy: {name: 'George', personality: 'curious'}

    accessor().personality = 'disinterested' //this will not mutate the internal state

    expect(accessor().personality).toEqual('curious')
  })

  it("has automatically created get/setters",function(){
    var greatescape = o({name: 'harry', type: 'tunnel'})

    expect(greatescape.type()).toEqual('tunnel')
    
  })

  it('can be modified using various function syntaxes',function(){
    var greatescape = o({name: 'harry', type: 'tunnel'})

    //getter setters are automatically created!

    expect(greatescape('name')).toEqual('harry') //returns 'harry'

    greatescape('name','tom') //sets harry's name to 'tom'
    expect(greatescape('name')).toEqual('tom')
    
    //optional syntax for getting / setting is equivalent
    greatescape.type('mouse')

    expect(greatescape.type()).toEqual('mouse')

  })

  it('can remove records using varargs and arrays as input', function(){

    var witch = o()
      ('personality','wicked')
      ('occupation','witch')
      ('province','west')
      ('hat','pointy')
      ('skin','green')

    witch.remove('personality')

    witch.remove('occupation','province')

    //the above is equivalent to

    witch.remove(['hat','skin'])

    var keys = Object.keys(witch())
    expect(keys.length).toEqual(0)
  })

  it('can chain multiple commands', function(){
    var person = o()
      ('first','Clark')
      ('occupation','Journalist')
      ('last','Kent')


    person
      .first('Superman')
      .remove('last')
      .occupation(person.first())

    expect(person.occupation()).toEqual('Superman')
    expect(person().last).not.toBeDefined()
  })

  it('can handle multiple change handlers',function(){
    var root = 0;
    var head = 0;
    alice = o()
      ('location','wonderland')
      ('head','attached')
      .change(function(val,key,hash){
        root++;
      })
      .change(function(val,key,hash){
        root++;
      })
      .head.change(function(val,key,hash){
         head++;
      })
      .head.change(function(val,key,hash){
         head++;
      })
      .location('The Queen\'s Court') //triggers only the root change callback
      .remove('head') //triggers the head change and the change callback

    expect(root).toEqual(4)
    expect(head).toEqual(2)
  })

  it('can handle nested o\'s with multiple syntaxes',function(){
    parent = o()

    parent
      ('child',o())
      ('child')
        ('grandchild',o())
        ('grandchild')
          ('greatgrandchild',o())

    parent.child.grandchild.greatgrandchild('a',4)
    var result = parent('child')('grandchild')('greatgrandchild')('a')

    expect(result).toEqual(4)

  })

  it('change handlers work for nested o\'s',function(){
    var called = 0;
    parent = o()

    parent
      ('child',o())
      ('child')
        ('grandchild',o())
        ('grandchild')
          ('greatgrandchild',o())

    
    parent('child')('grandchild')('greatgrandchild')('a',0)
    parent('child')('grandchild')('greatgrandchild').a.change(function(){
      called++;
    })
    parent.child.grandchild.greatgrandchild('a',1)
    parent.child.grandchild.greatgrandchild('a',2)

    expect(called).toEqual(2)
    

  })
});
