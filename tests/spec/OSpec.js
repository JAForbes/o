describe("O", function() {
  var player;
  var song;

  beforeEach(function() {
  });

  it("initialization should accept a object literal with a change handler", function() {

    var called = 0;
    life = o({ age: 'young', innocence: true
    },function(val,key,hash){
      called++;
    })
    .age('older')

    expect(life().age).toEqual('older');
    expect(life('innocence')).toEqual(true);
  });

});
