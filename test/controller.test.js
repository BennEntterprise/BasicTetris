var assert = require('assert') ;
const tetris = require('../public/tetris');

const collide = tetris.collide();
const merge = tetris.merge();
const controller = require('../public/controller')

describe('Array', function(){
  describe('#indexOf', function(){
    it('should return -1 when the value is not present',function(){
      //Set up
      player = new Object({pos:
        {x: 0 , y : 0}
      });
      const initYValue = player.pos.y

      //Test
      controller.playerDrop();
      const finalYValue = player.pos.y

      assert.equal(finalYalue - initYValue , 1);
        //Teardown


    });
  });
});
