let canvas;//byrja ad setta in hluti sem eg mun nota oft
let ctx;
let canvasWidth = 1000;//canvas size
let canvasHeight = 900;
let keys = []; //key array
let shots = [];//shots array
let asteroids = [];//astroid array
let ship;
document.addEventListener('DOMContentLoaded',Start);//nær i start functionið
function Start(){
    ship = new Ship();
    canvas = document.getElementById("gamecanvas");//bakrunnur
    ctx = canvas.getContext("2d");//nær i canvas contexið 2d
    canvas.width = canvasWidth;//canvas breið
    canvas.height = canvasHeight;//canvas hæð
    ctx.fillStyle = "black";//bakruns litur
    ctx.fillRect(0, 0, canvas.width, canvas.height);//backrunnur
   for(let i = 0; i < 8; i++){asteroids.push(new Asteroid());}//byr til nyja asteroids
  document.body.addEventListener("keydown",function(e){//hlustar eftir keydown event
     keys[e.keyCode]= true;
    });

    document.body.addEventListener("keyup", function(e){//hlustar eftir keyup event
        keys[e.keyCode]= false;
        if(e.keyCode === 32){
          shots.push(new shoot(ship.a));//skytur þegar þú slepir space barinu
        }
    });

function Animation(){
  function render(){
    if (shots.length !== 0) {
      for (let i = 0; i < shots.length; i++) {
        shots[i].Update();
        shots[i].Draw();
      }
    }
       if (asteroids.length !== 0) {
      for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].Update();
        asteroids[i].Draw();
      }
    }
}
    ship.moving = (keys[38]);//byrjar ad rendera ef skipið er að hreyfa afram
    if(keys[40]){
      ship.movingback;
    }
    if(keys[39]){// beygir til hægri með hægri ör
        ship.Rotate(1);
    }
    if(keys[37]){//beygir til vinstri með vinstri ör
      
        ship.Rotate(-1);
    }
     ctx.clearRect(0,0,canvasWidth,canvasHeight);//resetar bakrunninum
 ship.Update();//nér í ship updatið
 ship.Draw();//nær í ship drawið
 render();
 requestAnimationFrame(Animation);//loopar animation fallinu
}
 Animation();//kallar í animation fallið
}
class DetectCollision{
 constructor(thing1x,thing2x,thing1y,thing2y,thingradius1,thingradius2){
  this.dx = thing1x - thing2x;
  this.dy = thing1y - thing2y;
  this.dist = Math.sqrt(dx * dx + dy * dy);
  
 }
  CalcColl(){
    if (dist > thingradius1 + thingradius2)
     {
         return true;
      }
  else {
    return false;
  }
}
}
class Ship {//class ship byrjun

    constructor(){//skipið sjáft
        this.x = canvasWidth / 2;// lætur skipið byrja í miðjunni
        this.y = canvasHeight / 2;// lætur skipið byrja í miðjunni
        this.velX =0;//hraði að x
        this.velY =0;//hraði að y
        this.rSpeed = 0.001;//beygju hraði
        this.radius = 20;//stærð af skipi
        this.a = 0;//átt
        this.moving = false;//byrjar i stoppi
        
        this.Color = 'white';//litur
        this.speed = 5;//hraði
        this.noseX = canvasWidth / 2 + 20;
        this.noseY = canvasHeight / 2 + 20;
    }
    Rotate(i){
        this.a += this.rSpeed * i;//reiknar hraða beygju
    }
    Update(){
        let radians = this.a / Math.PI * 180;//reiknar radius
        if (this.moving) {//hrefir sig afram
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        
        if(this.x < this.radius){//ef hann keyrir hægri megin af skjanum kemur hann frá vinstri
            this.x = canvas.width;
        }
        if(this.x > canvas.width){//ef hann keyrir vinstri megin af skjanum kemur hann frá hægri
            this.x = this.radius;
        }
        if(this.y < this.radius){//ef hann keyrir up af skjanum kemur hann frá bottnum
            this.y = canvas.height;
        }
        if(this.y > canvas.height){//ef hann keyrir nidur af skjanum kemur hann frá toppnum
            this.y = this.radius;
        }

        this.velX *= 0.5;//lækkar á hraðanum á skipi
        this.velY *= 0.5;

        this.x -= this.velX;
        this.y -= this.velY;
    }
    Draw(){
        ctx.strokeStyle = this.Color;//litur af skipinu
        ctx.beginPath();//byrjar ad teikna
        let hornpunktur = ((Math.PI * 2) / 3);
        let radians = this.a / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
        for (let i = 0; i < 3; i++) {//skrifar linu eftir cos og sin
            ctx.lineTo(this.x - this.radius * Math.cos(hornpunktur * i + radians), this.y - this.radius * Math.sin(hornpunktur * i + radians));
        }
        ctx.closePath();//lokar þríhrininginum
        ctx.stroke();
    } 
}//class ship endir
class shoot{//class shooting byrjun
    constructor(a){
      this.x = ship.noseX;
      this.y = ship.noseY;
      this.a = a;
      this.height = 4;
      this.width = 4;
      this.speed = 5;
      this.velx = 0;
      this.vely = 0;
      this.Color = 'red'

    }
    Update(){
      let radians = this.a / Math.PI * 180;
      this.x -= Math.cos(radians) * this.speed;
      this.y -= Math.sin(radians) * this.speed;
          }
    Draw(){
      ctx.fillStyle = this.Color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}//class shooting endir
class Asteroid{//class asteroids byrjun
    constructor(x,y){
      this.x = Math.floor(Math.random() * canvasWidth);//spawn punktar á x ás fyrir asteroids
      this.y = Math.floor(Math.random() * canvasHeight);//spawn punktar á y ás fyrir asteroids
      this.a = Math.floor(Math.random() * 359);//lætur asteriods spawna í random átt
      this.speed = 1;//hraði asteroids
      this.radius = 50;//stærð
      this.Color = 'white';//litur
    }

    Update(){
      let radians = this.a / Math.PI * 180;//reiknar radious
      this.x += Math.cos(radians) * this.speed; //reiknar hraða asteroids
      this.y += Math.sin(radians) * this.speed; //reiknar hraða asteroids
      
      if(this.x < this.radius){//ef hann keyrir hægri megin af skjanum kemur hann frá vinstri
          this.x = canvas.width;
        }
         if(this.y < this.radius){//ef hann keyrir up af skjanum kemur hann frá bottnum
            this.y = canvas.height;
        }
        if(this.x > canvas.width){//ef hann keyrir vinstri megin af skjanum kemur hann frá hægri
            this.x = this.radius;
        }
        if(this.y > canvas.height){//ef hann keyrir nidur af skjanum kemur hann frá toppnum
            this.y = this.radius;
        }

    }
    Draw(){
      ctx.beginPath();
      let hornpunktur = ((Math.PI * 2) / 6);//reiknar hornpunktar fyir asteroids
      let radians = this.a / Math.PI * 180; //reiknar radious
      for (let i = 0; i < 6; i++) {//skrifar linu eftir cos og sin 6 sinnum
            ctx.lineTo(this.x - this.radius * Math.cos(hornpunktur * i + radians), this.y - this.radius * Math.sin(hornpunktur * i + radians));
        }
    ctx.closePath();
    ctx.stroke();
    }

}//class asteroids endir

