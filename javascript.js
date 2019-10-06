let canvas;//byrja ad setta in hluti sem eg mun nota oft
let ctx;
let canvasWidth = 1200;//canvas breið
let canvasHeight = 900;//canvas hæð
let keys = []; //key array
let shots = [];//shots array
let asteroids = [];//astroid array
let ship;
let shooting = new Audio('shoot.mp3'); //sound effectar
let music = new Audio('music.mp3');
let explode = new Audio('explode.mp3')
let score = 0;//stig
let life = 1;//lif
document.addEventListener('DOMContentLoaded',Start);//nær i start functionið
function Start(){
  ship = new Ship();

  document.body.addEventListener("keydown",function(e){//hlustar eftir keydown event
     keys[e.keyCode]= true;
    });
  document.body.addEventListener("keyup", function(e){//hlustar eftir keyup event
        keys[e.keyCode]= false;
    });

 buildcanvas();//kallar í animation fallið
 Animation();//kallar í animation fallið
}

function buildcanvas(){
    canvas = document.getElementById("gamecanvas");//bakrunnur
    ctx = canvas.getContext("2d");//nær i canvas contexið 2d
    canvas.width = canvasWidth;//canvas breið
    canvas.height = canvasHeight;//canvas hæð
    ctx.fillStyle = "black";//bakruns litur
    ctx.fillRect(0, 0, canvas.width, canvas.height);//backrunnur
}

function Animation(){
    function shoots_and_Asteroids(){

        if(keys[32]){//ef space bar er down þá skytur hann
             shots.push(new shoot(ship.a));//byr til skot
             shooting.play();// nær is shooting sound effectið
           }
        if (shots.length > 0 || 0 < asteroids.length) {// ef arrayin shots eða asteroids er meira en null updetar hann með for loppu
         for (let i = 0; i < shots.length; i++) {//updetar postinnin af skotanum
           shots[i].Update();
           shots[i].Draw();
         }
          for (let i = 0; i < asteroids.length; i++) {//updetar postinnin af asteroids
           asteroids[i].Update();
           asteroids[i].Draw();
         }
       }
       if(asteroids.length <= 10)//byr til nyja asteroids ef það er minna en 10
       {
           asteroids.push(new Asteroid());
       }
       for (a in asteroids) {// for in loopu fyrir árekstur milli asteroids og skotin
          for (s in shots) {//ef asteroid a fer í shots s þá eyða þau hvort annað með spilce og adda svo score
              if (asteroids[a].x >= shots[s].x && asteroids[a].x <= shots[s].x + asteroids[a].radius && asteroids[a].y >= shots[s].y && asteroids[a].y <= shots[s].y + asteroids[a].radius) 
              {
                  shots.splice(s, 1);//notar splice til að eyða skotin og asteroids þegar þau hitta hvort annað
                  asteroids.splice(a,1);
                  score++
                  return;
              }
          }
        for (a in asteroids){// for in loopu fyrir árekstur milli asteroids og skip
            if (ship.x >= asteroids[a].x && ship.x <= asteroids[a].x + asteroids[a].radius && ship.y >= asteroids[a].y && ship.y <= asteroids[a].y + asteroids[a].radius) {
                explode.play(); //spilar explode.mp3
                life--;//tekur líf í burtu
                return;
            }
        }
       }
   }
    ship.moving = (keys[38]);//skipið keyrir afram ef up arrow er clickað á 
    if(keys[39]){// beygir til hægri með hægri ör
        ship.Rotate(1);

    }
    if(keys[37]){//beygir til vinstri með vinstri ör
      
        ship.Rotate(-1);
    }
    function Score(){//score textin
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("SCORE : " + score, 20, 35);
    ctx.fillText("Skota 100 til að vinna",20,55)
    }
 ctx.clearRect(0,0,canvasWidth,canvasHeight);//resetar bakrunninum
 ship.Update();//nér í ship updatið
 ship.Draw();//nær í ship drawið
 Score();//nær í score fallið
 shoots_and_Asteroids();//nær í shoots_and_asteroids fallið
 music.play();//spilar music í backrunninum

 if (score === 100) {//ef score er 100 stopar leikurinn
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.font = '100px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("you win",canvasWidth / 2,canvasHeight / 2)
    cancelAnimationFrame(Animation);
    document.body.removeEventListener("keydown", HandleKeyDown);
    document.body.removeEventListener("keyup", HandleKeyUp);
 }
 if (life === 0) //ef life er 0 stopar leikurinn
 {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.font = '100px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("you lose",canvasWidth / 2,canvasHeight / 2)
    cancelAnimationFrame(Animation);
    document.body.removeEventListener("keydown", HandleKeyDown);
    document.body.removeEventListener("keyup", HandleKeyUp);
 }
 else{
    requestAnimationFrame(Animation);//loopar animation fallinu
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
        this.noseX = canvasWidth / 2 + 20;//fyrir shoot classið
        this.noseY = canvasHeight / 2 + 20;//fyrir shoot classið
    }
    Rotate(i){
        this.a += this.rSpeed * i;//reiknar hraða beygju
    }
    Update(){
        let radians = this.a / Math.PI * 180;//reiknar radius
        if (this.moving) {//reikanr hvar skipið er
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

        this.x -= this.velX;//lækkar á hraða ef það er ekki ýtt a takka
        this.y -= this.velY;//lækkar á hraða ef það er ekki ýtt a takka
    }
    Draw(){
        ctx.strokeStyle = this.Color;//litur af skipinu
        ctx.beginPath();//byrjar ad teikna
        let hornpunktur = ((Math.PI * 2) / 3);//reiknar hornpukt
        let radians = this.a / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);//reiknar nose punktinn á x-ás
        this.noseY = this.y - this.radius * Math.sin(radians);//reiknar nose punktinn á y-ás
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
      this.Color = 'red';

    }
    Update(){//updatear stað setningu skotin
      let radians = this.a / Math.PI * 180;
      this.x -= Math.cos(radians) * this.speed;
      this.y -= Math.sin(radians) * this.speed;
          }
    Draw(){//skrifar skotin
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
        if(this.x > canvas.width){//ef hann keyrir vinstri megin af skjanum kemur hann frá hægri
            this.x = this.radius;
        }
        if(this.y < this.radius){//ef hann keyrir up af skjanum kemur hann frá bottnum
            this.y = canvas.height;
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
