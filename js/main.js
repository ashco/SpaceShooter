var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game',
  {init:init, preload:preload, create:create, update:update});
var bg;
var music;
var player;
var cursors;
var lasers;
var pewpew;
var explosions;
var enemies;
var weaponTimer = 0;

function init(){
  game.enterKeyUp = true;
  displayHighScores();
}

function preload(){
  //Set physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
  //Load img
  game.load.image('bg', '../assets/img/cool-space-background.jpg');
  game.load.image('player', '../assets/img/ship.png');
  game.load.image('laser', '../assets/img/beam.png');
  game.load.image('enemy', '../assets/img/enemy1.png')

  //load spritesheets (animations)
  game.load.spritesheet('smallboom', '../assets/img/explosion.png', 64, 64);




  //Load Audio
  game.load.audio('music', '../assets/audio/Shadelike.mp3');
  game.load.audio('pewpew', '../assets/audio/laser.mp3');
  game.load.audio('kaboom', '../assets/audio/explosion.mp3');
}

function create(){
  // Create the background and make it scroll
  bg = game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg');
  bg.autoScroll(-30, 0);

  // Setup Sounds & Start background music
  pewpew = game.add.audio('pewpew', 0.05, false);
  kaboom = game.add.audio('kaboom', 0.3, false);
  music = game.add.audio('music');
  music.play(); //background music

  // Create the player and place it inside the world bounds
  player = game.add.sprite(64, 200, 'player');
  player.anchor.setTo(0.5); //Middle
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true; 
  player.score = 0; //I made this, not Phaser
  player.life = FULL_LIFE;

  // Create laser objects for shooting
  lasers = game.add.group();
  lasers.enableBody = true; 
  lasers.physicsBodyType = Phaser.Physics.ARCADE;
  lasers.createMultiple(30, 'laser');
  lasers.setAll('outOfBoundsKill', true);
  lasers.setAll('checkWorldBounds', true)

  // Create missle objects for shooting

  // Create enemy objects, destroy when they leave the screen
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(30, 'enemy');
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);

  // Create explosion objects and their animations
  explosions = game.add.group();
  explosions.createMultiple(20, 'smallboom');
  explosions.forEach(function(ex){
    ex.animations.add('smallboom');
  });


  // Keyboard Listeners
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);

  // Initial Text

  //Spawn enemy every 2 seconds
  game.time.events.loop(Phaser.Timer.SECOND * 2, spawnEnemy, this);

}

function update(){
  player.body.velocity.set(0); //stop the player if an arrow key isn't down;
  //Keyboard detection
  if(cursors.left.isDown){
    player.body.velocity.x = -PLAYER_SPEED;
  }
  else if (cursors.right.isDown){
    player.body.velocity.x = PLAYER_SPEED;
  }
  else if(cursors.down.isDown){
    player.body.velocity.y = PLAYER_SPEED;
  }
  else if (cursors.up.isDown){
    player.body.velocity.y = -PLAYER_SPEED;
  }

  if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
    fireWeapon();
  }
  //Collision detection
  game.physics.arcade.overlap(player, enemies, selfDamage, null, this);
}
