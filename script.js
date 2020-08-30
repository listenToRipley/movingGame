let canvas = document.getElementById('myCanvas');

//determine why type of image; context is a canvas related thing
let ctx = canvas.getContext('2d');

let screenWidth = 750;
let screenHeight = 500;
const width = 50 
let gameLive = true

class GameCharacter {
  constructor(x, y, w, h, c, s) {
    this.x = x;
    this.y = y; 
    this.w = w; //width
    this.h = h;//height
    this.c = c; //color
    this.s = s; //speed
    this.maxSpeed = 3;  //the fastest you can go
  }
  moveHorizonal() {

    if(this.x > screenWidth-35) {
      this.s = -this.s
    } 
    //won't move after it's at 24, *** need to work on
    // else if (this.x < 24) {
    //   this.s = 0
    // }
   this.x += this.s;
    }

  moveVertical() {

   if(this.y > screenHeight-75) {
      this.s = -this.s
    } else if (this.y < 25) {
      this.s = -this.s
    }

   this.y += this.s;
    }
  }

let pieces = [
  new GameCharacter (75, 50, width, width, "#a6dc28", 2),
  new GameCharacter ((screenWidth/2)-25, screenHeight-150, width, width, "#a6dc28", 1),
  new GameCharacter ((screenWidth-100), 50, width, width, "#a6dc28", 3),
  ]

let player = new GameCharacter(15, 225, 15, 15, "#bb4c63", 0)

let goal = new GameCharacter((screenWidth-25), 225, width, width, "#2cedcb", 0)

//key down and key up, think of booleans. 
//click events for movement
document.onkeydown = (event) => {
 //each key has its own code, this allows the document to listen to specific key clicks 
let keyPressed = event.keyCode;

//left
  if(keyPressed === 39) {
    player.s = player.maxSpeed; 
    //right
  } else if (keyPressed === 37) {
    player.s = -player.maxSpeed
  }
    //these movements will be hortizontal ** has some weird reactions, should work on that. 
    //up
   else if (keyPressed === 38) {
      player.s = player.maxSpeed; 
    //down
  } else if (keyPressed === 40) {
      player.s = -player.maxSpeed; 
  }
}

//release the press - still moving even when up, **need to work on this 
document.onkeyup = (event) => {
    let keyPressed = event.keyCode;

  if(keyPressed === 39 || keyPressed === 37) {
        player.s = 0;
  }

}

//check to see if my blocks collide 
let collisions = (rect1, rect2) => {
  //something not  quite right about this since it starts with a collision
    //always treat rect2 as the player
  let xOverlap = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
  let yOverlap = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);

  if (xOverlap && yOverlap){
    rect2.s = 0 
    return true 
  };
} 

let sprites = {};

let draw = () => {
  //clear the canvas
  ctx.clearRect(0,0, screenWidth, screenHeight);

  sprites.background = new Image();
  sprites.background.addEventListener('load', () => {
    ctx.drawImage(sprites.background, 0, 0);
  })
  sprites.background.src= 'images/floor.png';


    sprites.player = new Image();
    sprites.player.addEventListener('load', () => {
      ctx.drawImage(sprites.player, player.x, player.y);
    }, false)
    sprites.player.src='./images/hero.png'
  
    sprites.pieces = new Image();
    sprites.pieces.addEventListener('load', () => {
      pieces.forEach((element) => {
        ctx.drawImage(sprites.pieces, element.x, element.y);
      })
    })
    sprites.pieces.src = 'images/enemy.png'

    sprites.goal = new Image();
    sprites.goal.addEventListener('load', ()=> {
      ctx.drawImage(sprites.goal, goal.x, goal.y);
    })
    sprites.goal.src = 'images/chest.png'

  console.log('the sprites.player: ', sprites.player, ': the player x>',player.x)
  ctx.drawImage(sprites.background, 0, 0);
  ctx.drawImage(sprites.player, player.x, player.y);
  ctx.drawImage(sprites.goal, goal.x, goal.y);

  pieces.forEach((element) => {
    ctx.drawImage(sprites.pieces, element.x, element.y);
  })
  
}

draw();

//move the pieces around the canvas
let update = () => {
  //check to see first if you have reached the goal
   if(collisions(goal, player)) {
    endGame('You!')
    console.log('YOU MADE IT!')
   }

  //check for a hit first
  pieces.forEach((element)=> {
    if(collisions(element, player)) {
      endGame('Game over')
      console.log('you hit something!', player.x)
    }
    element.moveVertical();
  })

  player.moveHorizonal(); 
  player.moveVertical();
  draw();
}

let endGame = (text) => {
  player.s = 0 
  gameLive = false;
  console.log(text);
  window.location = "";
}

//game loop, the logic for movement 
let step = () => {
  update();
  //prevent repeats
  //if(gameLive){
  //perform the next animation process, simulations while loops 
  window.requestAnimationFrame(step);
  //}
}

//loadSprites();
step();
