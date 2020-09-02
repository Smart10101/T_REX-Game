var trex, treximg, ground, groundImg, invisibleGround, clouds, cloudsImg, obstacles, obstaclesImg, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, selector, trex_collide, restart, gameOver,restartAnimation,gameOverAnimation, checkPoint, jump, dead;

var score = 0;
var highScore = [];
highScore = 0;

var cloudGroup, obstacleGroup;

var gameState = "PLAY";

function preload() {
  treximg = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  groundImg = loadImage("ground2.png");
  cloudsImg = loadImage("cloud.png");
  obstacles1 = loadImage("obstacle1.png");
  obstacles2 = loadImage("obstacle2.png");
  obstacles3 = loadImage("obstacle3.png");
  obstacles4 = loadImage("obstacle4.png");
  obstacles5 = loadImage("obstacle5.png");
  obstacles6 = loadImage("obstacle6.png");
  trex_collide = loadImage("trex_collided.png");
  restart = loadImage("restart.png");
  gameOver = loadImage("gameOver.png");
  
  checkPoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
  dead = loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50, 175, 10, 10);
  trex.addAnimation("trex", treximg);
  trex.scale = 0.5;

  ground = createSprite(300, 180, 600, 20);
  ground.addAnimation("ground", groundImg);

  invisibleGround = createSprite(300, 195, 600, 20);
  invisibleGround.visible = false;

  cloudGroup = new Group();
  obstacleGroup = new Group();
  
  restartAnimation = createSprite(285,110,30,30);
  restartAnimation.addAnimation("gameRestart", restart);
  restartAnimation.scale = 0.65;
  restartAnimation.visible = false;
  
  gameOverAnimation = createSprite(285, 70,30,30);
  gameOverAnimation.addAnimation("gameFinished",gameOver);
  gameOverAnimation.scale = 0.5;
  gameOverAnimation.visible = false;
}

function draw() {
  background("white");
  drawSprites();
  
  trex.collide(invisibleGround);
  
  textSize(15);
  text("Score: "+Math.round(score),100,50);
  textSize(15);
  text("HighScore: "+Math.round(highScore),300,50);

  if (gameState === "PLAY") {
    
    score = score + 0.1;

    ground.velocityX = -2;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && trex.y >= 161) {
      trex.velocityY = -13;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.8;
    
    if(score % 100 === 0){
      checkPoint.play(); 
    }
    
    if(trex.isTouching(obstacleGroup)){
      gameState = "END";
      dead.play();
    }

    spawnClouds();
    spawnObstacles();
  }
  
  if(gameState === "END"){
    trex.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.addAnimation("trex_collided",trex_collide);
    trex.changeAnimation("trex_collided",trex_collide);
    restartAnimation.visible = true;
    gameOverAnimation.visible = true;
    if(mousePressedOver(restartAnimation)){
      reset(); 
    }
  }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    clouds = createSprite(600, random(80, 120), 30, 30);
    clouds.addAnimation("cloud", cloudsImg);
    clouds.scale = 0.7;
    clouds.velocityX = -3;
    clouds.lifetime = 200;
    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudGroup.add(clouds);
  }
}

function spawnObstacles() {
  if (frameCount % 65 === 0) {
    obstacles = createSprite(600, 170, 30, 30);
    selector = Math.round(random(1, 6));
    obstacles.velocityX = -3;
    switch (selector) {
      case 1:
        obstacles.addImage(obstacles1);
        break;
      case 2:
        obstacles.addImage(obstacles2);
        break;
      case 3:
        obstacles.addImage(obstacles3);
        break;
      case 4:
        obstacles.addImage(obstacles4);
        break;
      case 5:
        obstacles.addImage(obstacles5);
        break;
      case 6:
        obstacles.addImage(obstacles6);
        break;
      default:
        break;
    }
    obstacles.scale = 0.5;
    obstacles.lifetime = 200;
    obstacleGroup.add(obstacles);
  }
}

function reset(){
  trex.changeAnimation("trex", treximg);
  restartAnimation.visible = false;
  gameOverAnimation.visible = false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  gameState = "PLAY";
  
  if(score > highScore){
    highScore = score;
  }
  
  score = 0;
}