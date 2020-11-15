//Create variables here
var dog;
var dogImg,happyDogImg;
var database;
var foodS,foodStock;
var feedFood,addFood;
var fedTime,lastFed;
var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  
  dog = createSprite(250,350,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.175;

  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  feedFood = createButton("Feed the dog");
  feedFood.position(700,95);
  feedFood.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


}


function draw() {  
  background(46,139,87);

  //add styles here
  noStroke();
  textSize(15);
  fill("white");
  text("Food remaining: "+foodS,175,280);

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed: "+lastFed%12 + "PM", 350,30);
  }
  else if(lastFed == 0){
    text("Last Feed: 12 AM", 350,30);
  }
  else{
    text("Last Feed: "+ lastFed + "AM", 350,30);
  }

  foodObj.display();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x = x-1;
  }

  database.ref('/').update({
    food: x
  })
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    FeedTime: hour(),
  })
}

function addFoods(){
  foodS++;
  console.log("food stock"+foodS);
  database.ref('/').update({
    food: foodS
  })
}