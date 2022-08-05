/*
References: 
Music: David Vitas -RPG Music Pack
https://www.davidvitas.com/portfolio/2016/5/12/rpg-music-pack
Sounds: https://opengameart.org/content/rpg-sound-pack artisticdude

https://love2dev.com/blog/javascript-remove-from-array/

https://github.com/mattdesl/lerp/blob/master/index.js
*/

let canvas;
let context;

let request_id;
let fpsInterval = 100/3; //change number
let now;
let then = Date.now();
let start = Date.now();

let speed = 3;
let player = {
    x : 230,
    y : 130,
    oldx : 250,
    oldy : 250,
    size: 10,
    width: 12,
    height: 25,
    frameX: 0,
    frameY: 0,
    xChange : speed,
    yChange : speed,
    recharge : 5000,
    wait : 500
};


let bo = {
    x : player.x + player.width,
    y : player.y +2.5,
    xsize :5,
    ysize: 2.5,
    //speed of the bullets
    xChange: 10,  //randint(1, 10)
    yChange: 10
};
let kills = 0;
let powerup = [];
let enemies = [];
let people = [];
let sanc = 0;
let tp_c = 4;
let e_c = 3;
let b_c = 5;
let bullets = [];
let e_bullets = [];
let score = 0;
let x = 100;
let movement = [-1, -0.75, -0.5, -0.25, 1, 0.75, 0.5, 0.25]
let Movement = [-2, -1.75, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 1, 0.75, 0.5, 0.25, 2, 1.75, 1.5, 1.25]

//POWER UP
let num = 0;
let index = 0;

let hide = document.querySelector('#left nav ul')
let xhttp;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let sounds = true;
let fire = false;
let face;
let face_obs = '';

//movement
let move = randint(-1, 1);

let playerImage = new Image();
let backgroundImage = new Image();
let enemyImage = new Image();
let tpImage = new Image();
let f_life = new Image();
let bulletImage = new Image();
let backgroundMusic = new Audio();
let obstacleMusic = new Audio();
let bulletMusic = new Audio();
let manaMusic = new Audio();


let tilesPerRow = 19;

let tileSize = 16; //in px  19 across 45 down
let background1 = [
    [187, 180, 181, 182, 183, 184, 185, 186, 187, 180, 181, 182, 183, 0, 0, 0, 0, 180, 181, 182, 183, 184, 185, 186, 187, 180, 181, 182, 183, 184],
    [206, 199, 200, 201, 202, 203, 204, 205, 206, 199, 200, 201, 202, 47, 25, 28, 44, 199, 200, 201, 202, 203, 204, 205, 206, 199, 200, 201, 202, 203],
    [225, 218, 219, 220, 221, 222, 223, 224, 225, 218, 219, 220, 221, 47, 44, 47, 44, 218, 219, 220, 221, 222, 223, 224, 225, 218, 219, 220, 221, 222],
    [65, 64, 65, 64, 65, 64, 41, 627, 628, 629, 630, 631, 66, 48, 44, 47, 48, 44, 627, 628, 629, 630, 631, 43, 65, 41, 792, 793, 794, 0],
    [28, 25, 26, 27, 26, 27, 22, 64, 647, 648, 649, 650, 47, 48, 44, 47, 48, 44, 646, 647, 648, 649, 650, 47, 26, 60, 811, 812, 813, 347],
    [47, 44, 294, 295, 296, 297, 298, 665, 666, 667, 668, 669, 47,48, 44, 47, 48, 44, 665, 666, 667, 668, 669, 47, 0, 60, 830, 831, 832, 349],
    [47, 44, 313, 314, 315, 316, 317, 684, 685, 686, 687, 688, 47, 48, 44, 47, 48, 44, 684, 685, 686, 687, 688, 47, 0, 44, 849, 850, 851, 47],
    [66, 44, 332, 333, 334, 335, 336, 43, 65, 96, 64, 65, 66, 48, 63, 66, 48, 63, 64, 65, 96, 65, 64, 66, 64, 63, 64, 115, 64, 66],
    [48, 63, 64, 65, 64, 65, 64, 66, 63, 65, 66, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48],
    [27, 26, 27, 26, 27, 28, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 25, 26, 27, 26, 27, 26, 28, 48, 48],
    [351, 352, 353, 354, 355, 62, 25, 28, 25, 26, 27, 26, 27, 26, 27, 26, 27, 26, 27, 28, 48, 44, 0, 0, 0, 0, 0, 47, 48, 48],
    [370, 371, 372, 373, 374, 62, 44, 47, 44, 342, 343, 268, 0, 0, 0, 566, 567, 304, 305, 47, 48, 63, 64, 65, 64, 65, 64, 66, 48, 48],
    [389, 390, 391, 392, 393,62, 44, 47, 44, 361, 362, 67, 0, 0, 0, 0, 68, 323, 324, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48 ],
    [289, 290, 290, 290, 291, 62, 44, 47, 44, 11, 12, 86, 87, 86, 87, 86, 87, 12, 13, 25, 28, 25, 26, 27, 26, 27, 26, 28, 48, 48],
    [308, 792, 793, 794, 308, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47, 133, 134, 135, 136, 137, 137, 138, 25, 28],
    [308, 811, 812, 813, 347, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47, 152, 0, 0, 0, 0, 0, 157, 44, 47],
    [308, 830, 831, 832, 349, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47, 152, 0, 0, 0, 0, 0, 157, 44, 47],
    [327, 849, 850, 851, 327, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47, 171, 0, 0, 0, 247, 248, 157, 44, 47],
    [233, 44, 114, 47, 233, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47, 171, 268, 173, 174, 266, 267, 176, 44, 47],
    [234, 44, 115, 47, 234, 47, 44, 47, 44, 30, 31, 86, 87, 86, 87, 86, 87, 31, 32, 44, 47,  190, 191, 192, 193, 194, 194, 195, 44, 47],
    [293, 63, 65, 66, 273, 47, 63, 66, 44, 49, 50, 105, 106, 105, 106, 105, 106, 50, 51, 63, 66, 63, 65, 64, 65, 64, 65, 66, 63, 66],
    [25, 26, 27, 26, 27, 28, 48, 48, 25, 26, 27, 124, 249, 249, 249, 249, 125, 24, 27, 28, 48, 48, 27, 26, 27, 27, 26, 27, 28, 48],
    [63, 65, 65, 64, 65, 66, 48, 48, 63, 64, 65, 64, 65, 64, 65, 64, 65, 64, 65, 66, 48, 48, 65, 64, 65, 64, 65, 64, 66, 48],
    [289, 290, 290, 290, 291, 25, 27, 28, 289, 290, 290, 290, 290, 290, 290, 290, 290, 290, 290, 290, 291, 47, 25, 28, 44, 289, 290, 290, 290, 291,],
    [308, 485, 486, 487, 308, 44, 0, 47, 308, 789, 790, 791, 561, 562, 563, 564, 565, 789, 790, 791, 308, 47, 44, 47, 44, 308, 485, 486, 487, 308],
    [308, 504, 505, 506, 347, 44, 0, 47, 308, 808, 809, 810, 580, 581, 582, 583, 584,  808, 809, 810, 308, 47, 44, 47, 44, 347, 504, 505, 506, 308],
    [308, 523, 524, 525, 349, 44, 0, 47, 308, 827, 828, 829, 599, 600, 601, 602, 603,  827, 828, 829, 308, 47, 44, 47, 44, 349, 523, 524, 525, 308],
    [327, 542, 543, 544, 327, 44, 0, 47, 274, 846, 847, 848, 618, 619, 620, 621, 622, 846, 847, 848, 293, 47, 44, 47, 44, 327, 542, 543, 544, 327],
    [48, 115, 114, 115, 48, 63, 65, 66, 63, 64, 66, 65, 64, 65, 63, 64, 65, 64, 66, 64, 65, 66, 63, 66, 44, 249, 115, 114, 115, 249],
    [25, 26, 27, 27, 28, 25, 28, 25, 27, 26, 27, 26, 27, 26, 27, 26, 27, 26, 27, 26, 27, 28, 25, 28, 48, 25, 26, 27, 27, 28]
    ];

document.addEventListener("DOMContentLoaded", init, false);


function init() {
    
    canvas = document.querySelector("canvas");  
    context = canvas.getContext("2d"); 

    load_audio(['static/background.wav', 'static/beads.wav', 'static/bullet.wav', 'static/mana.wav'])

    load_images(['static/sheet.png','static/workreally.png','static/enemy1.png', 'static/flip.png',
    'static/townspeople.png', 'static/f_heart.png'])

    backgroundImage.src = 'static/sheet.png';
    playerImage.src = 'static/workreally.png';
    enemyImage.src = 'static/enemy1.png';
    f_life.src = 'static/flip.png';
    tpImage.src = 'static/townspeople.png';
    bulletImage.src = 'static/f_heart.png';
    backgroundMusic.src = 'static/background.wav';
    obstacleMusic.src = 'static/beads.wav';
    bulletMusic.src = 'static/bullet.wav';
    manaMusic.src = 'static/mana.wav';



    window.addEventListener('keydown', activate, false);
    window.addEventListener('keyup', deactivate, false);
  //window.addEventListener('click', coord, false);

    draw();
}

function draw() {
    hide.style.visibility = 'hidden';
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval); 

    //background
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#88deff"; // light sky blue  74e5ff 58d1ff
    context.fillRect(0, 0, canvas.width, (3*tileSize)); //sky
    context.fillStyle = "#79c867";
    context.fillRect(0, tileSize, canvas.width, canvas.height);
    let obstacles =[
        {x : 0, y : 0, width : 13*tileSize, height : 3*tileSize}, 
        {x : 17*tileSize, y : 0, width : 13*tileSize, height : 3*tileSize},
        {x : 7*tileSize, y : 1*tileSize, width : 5*tileSize, height : 4*tileSize},
        {x : 2*tileSize, y : 4.75*tileSize, width : 5*tileSize, height : 3*tileSize}, 
        //top mid
        {x : 14.95*tileSize, y : 1.75*tileSize, width : .1*tileSize, height : 5.3*tileSize},
        //mid left house
        {x : 0, y : 10*tileSize, width : 4.8*tileSize, height : 5.9*tileSize},
        {x : 0, y : 15.5*tileSize, width : .9*tileSize, height : 4*tileSize},
        {x : 4*tileSize, y : 15.5*tileSize, width : 0.9*tileSize, height : 4*tileSize},
        //left house
        {x : 0, y : 23.3*tileSize, width : 4.8*tileSize, height : 2.3*tileSize},
        {x : 0, y : 25.25*tileSize, width : .9*tileSize, height : 2.2*tileSize},
        {x : 4*tileSize, y : 25.2*tileSize, width : .8*tileSize, height : 2.2*tileSize},
        //mid line bot
        {x : 6.35*tileSize, y : 24*tileSize, width : .3*tileSize, height : 4*tileSize},
        //bot mid houses
        {x : 8.25*tileSize, y : 23.5*tileSize, width : 12.75*tileSize, height : 2.25*tileSize},
        //divisions
        {x : 8.25*tileSize, y : 25*tileSize, width : .9*tileSize, height : 2.8*tileSize},
        {x : 11.5*tileSize, y : 25*tileSize, width : .9*tileSize, height : 3*tileSize},
        {x : 11.5*tileSize, y : 25*tileSize, width : 1.9*tileSize, height : 3*tileSize},
        {x : 15.5*tileSize, y : 25*tileSize, width : 1.9*tileSize, height : 3*tileSize},
        {x : 20*tileSize, y : 25*tileSize, width : .9*tileSize, height : 3*tileSize},
        //bot right house
        {x : 25*tileSize, y : 23.5*tileSize, width : 45*tileSize, height : 2.5*tileSize},
        {x : 25*tileSize, y : 25.25*tileSize, width : .9*tileSize, height : 2.2*tileSize},
        {x : 29*tileSize, y : 25.7*tileSize, width : 1.2*tileSize, height : 2.2*tileSize},
        // right mid line bot
        {x : 22.9*tileSize, y : 23.7*tileSize, width : .15*tileSize, height : 4.25*tileSize},
        // mid right line
        {x : 28.9*tileSize, y : 15*tileSize, width : .15*tileSize, height : 4.75*tileSize},
        {x : 19.9*tileSize, y : 14*tileSize, width : .15*tileSize, height : 6*tileSize},
        {x : 6.9*tileSize, y : 11*tileSize, width : .15*tileSize, height: 9.2*tileSize},
        //pond
        {x : 9.25*tileSize, y : 12.3*tileSize, width : 1.7*tileSize, height : 7.8*tileSize},
        {x : 17*tileSize, y : 12.3*tileSize, width : 1.7*tileSize, height : 7.8*tileSize},
        //stand of people
        {x : 21.3*tileSize, y : 14*tileSize, width : .3*tileSize, height : 5.75*tileSize},
        {x : 27.3*tileSize, y : 14*tileSize, width : .3*tileSize, height : 5.8*tileSize},
        {x : 25*tileSize, y : 17.25*tileSize, width : 2.3*tileSize, height : 2.5*tileSize},
        {x : 21.5*tileSize, y : 17.25*tileSize, width : 1.5*tileSize, height : 2.5*tileSize},
        {x : 21.3*tileSize, y : 14*tileSize, width : 6.25*tileSize, height : .7*tileSize},
        //right mid line 
        /*{x : 22*tileSize, y : 21.75*tileSize, width : 6.25*tileSize, height : .1*tileSize},*/
        //top mid line 
        {x : 22*tileSize, y : 10*tileSize, width : 5*tileSize, height : 1*tileSize},
        //house top right
        {x : 18*tileSize, y : 2*tileSize, width : 4.75*tileSize, height : 3*tileSize},
        {x : 26*tileSize, y : 2*tileSize, width : 4*tileSize, height : 3*tileSize},
        //top mid line
        {x : 24.25*tileSize, y : 5*tileSize, width : .5*tileSize, height : 2*tileSize}
        ]

    for (let r = 0; r < 30; r+=1){
        for (let c = 0; c < 30; c += 1){
            let tile = background1[r][c];
            if (tile >= 0){
                let tileRow = Math.floor(tile/ tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol*tileSize, tileRow*tileSize, tileSize, tileSize,
                    c*tileSize, r*tileSize, tileSize, tileSize);
            }
        }
    }
    //DRAW OBSTACLES
    for (let o of obstacles){
        context.fillStyle = 'rgba(0,0,0, 0)';
        //context.fillStyle = 'purple';
        context.fillRect(o.x, o.y, o.width, o.height);
    }

    //CHARACTER
    context.drawImage(playerImage,  
        player.width*player.frameX, player.height*player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);
    
    if ((moveLeft || moveRight || moveUp || moveDown) && ! (moveLeft && moveRight) ){
        player.frameX = (player.frameX + 1) % 3; 
    } 
    // MY CHARACTER STATS
    let stat = [
        {x: 0, y: 5, width: 144, height: 25,  frameX: 0, frameY: num,}
    ];
    drawLife(stat);

    //STATS IF - 
    if (num >= 10){
        stop();
    }
    if (num <= 0){
        num = 0;
    }
    //SCORE
    context.fillStyle = 'black';
    context.fillRect(0, 30, 115, 25);
    context.font = '20px Courier New';
    context.fillStyle = 'white';
    context.fillText('Score:' + score, 0, 48);
    // TOWNSPEOPLE
    let choose = [[0, 3, 6, 9, 12], [0, 4]]
    let fx = randint(0, choose[0].length-1)
    let fy = randint(0, choose[1].length-1)
    let townspeople = [
        {x : 140, y : 80, oldx : 140, oldy : 80, width: 16, height: 16, change: 0, Owait: 500, wait: 500,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10},
        {x : 320, y : 80, oldx : 320, oldy : 80, width: 16, height: 16, change: 0, Owait: 600, wait: 600,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 430, y : 80, oldx : 430, oldy : 80, width: 16, height: 16, change: 0, Owait: 750, wait: 750,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 430, y : 420, oldx : 430, oldy : 420, width: 16, height: 16, change: 0, Owait: 550, wait: 550,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 290, y : 420, oldx : 290, oldy : 420, width: 16, height: 16, change: 0, Owait: 500, wait: 500,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 225, y : 420, oldx : 225, oldy : 420, width: 16, height: 16, change: 0, Owait: 650, wait: 650,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 15, yArea: 10 },
        {x : 160, y : 420, oldx : 160, oldy : 420, width: 16, height: 16, change: 0, Owait: 500, wait: 500,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 30, y : 420, oldx : 30, oldy : 420, width: 16, height: 16, change: 0, Owait: 750, wait: 750,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 },
        {x : 30, y : 260, oldx : 30, oldy : 260, width: 16, height: 16, change: 0, Owait: 700, wait: 700,
        frameX: 0, frameY: 0, xChange: 0.5, yChange: 0, n:choose[0][fx], m:choose[1][fy], xArea: 10, yArea: 10 }
    ]

    //TOWNSPEOPLE SHOWING UP
    if (people.length < tp_c){
        people.push(townspeople[randint(0, townspeople.length- 1)]);
    }
    for (let t of people){
        context.drawImage(tpImage,
            t.width*t.frameX, t.height*t.frameY, t.width, t.height,
            t.x, t.y, t.width, t.height);
    }
    // IF POSITION IS OCCUPIED
    for (let p of people){
        for (let t of people){
            if (people.indexOf(p) != people.indexOf(t) && tp_collides(p, t) &&
            (p.xChange != 0 || t.xChange != 0 )){
                people.splice(people.indexOf(t), 1);
                //people.push(townspeople[randint(0, townspeople.length- 1)]);
            }
        }
    }

    //BULLETS - movement and shape
    context.fillStyle = "black";
    for (let b of bullets){
        context.drawImage(bulletImage, b.x, b.y, 10, 10);
        b.x += b.xChange;
        b.y += b.yChange;
        //if bullet go off the sides
        if (b.x + b.xsize >= canvas.width || b.x + b.xsize < 0 
            || b.y >= canvas.height || b.y < 0){
            bullets.splice(bullets.indexOf(b),1); 
        }  
    }
    //POWER UPS-- Le Manna
    if (powerup.length < 2){
        let random = {
            x: randint(0, canvas.width),
            y: 0,
            size: 10,
            xChange: 0,
            yChange: randint(0.5, 3)
        };
        if (random.x === player.x || random.y === player.y ){
            random.x = randint(0, canvas.width);
            random.y = 0
        }
        if (num >= 6){
            powerup.push(random);
        }
    } 
    context.fillStyle = 'red';
    for (let random of powerup){
        context.beginPath();
        context.ellipse(random.x, random.y, 3, 8, Math.PI / 4, 0, 2 * Math.PI);
        context.fillStyle = '#FAD68B';
        context.fill();
        context.strokeStyle = '#E8B345';
        context.stroke()
    }
    for (let random of powerup){
        if (random.x + random.size < 0 || random.y + random.size >= canvas.height 
            || random.x + random.size > canvas.width ){
            random.x = randint(0, canvas.width); 
            random.y = 0;
        } else{
            random.y += random.yChange;
        }
    }

    //ENEMIES
    if (sanc % 5 === 0 && sanc != 0){
        e_c = 5;
    }
    if (sanc % 7 === 0 && sanc != 0){
        e_c = 7;
    }
    let color = [[0,6], [0,4]] 
    let enemy_spawn =[
        {x : 5, y : 50, oldx : 5, oldy : 50, width: 16, height: 16, fly: 1, recharge: 1000, hit : 0, revert: 1500,
            frameX: 0, frameY: 0, n:color[0][randint(0,1)], m:color[1][randint(0,1)], xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)],  xArea: 150, yArea: 150 },
        //mid left enemy
        {x : 90, y : 150, oldx : 90, oldy :150, width: 16, height: 16, fly: 0, frameX: 0, frameY: 0, recharge: 1000, hit : 0, revert: 1500,
            xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
        {x : 350, y : 189, oldx : 5, oldy : 189, width: 16, height: 16, fly: 0, recharge: 1000, hit : 0, revert: 1500,
            frameX: 0, frameY: 0, xChange:movement[randint(0, movement.length-1)], yChange:movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
        //mid right enemy
        {x : 445, y : 200, oldx : 5, oldy : 189, width: 16, height: 16, fly: 0, recharge: 1000, hit : 0, revert: 1500,
            frameX: 0, frameY: 0, xChange:movement[randint(0, movement.length-1)], yChange:movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
        {x : 350, y : 189, oldx : 5, oldy : 189, width: 16, height: 16, fly: 0, recharge: 1000, hit : 0, revert: 1500,
            frameX: 0, frameY: 0, xChange:movement[randint(0, movement.length-1)], yChange:movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
            {x : 245, y : 300, oldx : 5, oldy : 189, width: 16, height: 16, fly: 0, recharge: 1000, hit : 0, revert: 1500,
                frameX: 0, frameY: 0, xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
        //flying
        {x : 225, y : 325, oldx : 5, oldy : 189, width: 16, height: 16, fly: 1, recharge: 1000, hit : 0, revert: 1500,
            frameX: 0, frameY: 0, xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
        {x : 230, y : 280, oldx : 5, oldy : 50, width: 16, height: 16, fly: 1, frameX: 0, frameY: 0, recharge: 1000, hit : 0, revert: 1500,
            xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 },
             //flying
        {x : 230, y : 300, oldx : 5, oldy : 50, width: 16, height: 16, fly: 1, frameX: 0, frameY: 0, recharge: 1000, hit : 0, revert: 1500,
            xChange: movement[randint(0, movement.length-1)], yChange: movement[randint(0, movement.length-1)], n:color[0][randint(0,1)], m:color[1][randint(0,1)], xArea: 100, yArea: 100 }
    ]; 
    if (enemies.length < e_c){
        enemies.push(enemy_spawn[randint(0, enemy_spawn.length- 1)]);
    }
    for (let e of enemies){
        context.drawImage(enemyImage,  
            e.width*e.frameX, e.height*e.frameY, e.width, e.height,
            e.x, e.y, e.width, e.height);
    }

    //MOVEMENT OF CHARACTER
    player.oldx = player.x;
    player.oldy = player.y;

    //MOVEMENT OF TOWNSPEOPLE
    for (let e of people){
        //CHANGE LOOK
        if (e.xChange != 0 || e.yChange != 0){
            e.frameX = e.n+(e.frameX + 1) % 3; 
        } 
        if (e.xChange < 0 ){
            e.frameY = 1 + e.m;
        }
        if (e.xChange > 0 ){
            e.frameY = 2+ e.m;
        }
        if (e.yChange > 0 ){
            e.frameY = 0 + e.m;
        }
        if (e.yChange < 0 ){
            e.frameY = 3 + e.m ;
        }
        e.x += e.xChange;
        e.y += e.yChange;   

        //COLLIDING WITH PLAYER
        if (player_collides(e) && player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275){
        } 
        else if (player_collides(e) && ! (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275)){
            e.xChange = 0;
            e.wait -= 10;
            if (e.wait === 0){
                e.x = lerp(e.x, randint(350, 420), 1);
                e.y = lerp(e.y, 260, 1);
                e.frameX = e.n;
                e.frameY = e.m;
                tp_c += 1;
                score += 20;
            } else if (e.wait < 0){
                e.wait = e.Owait;
            }
        } if (dist(e, player) >= 15 && e.xChange === 0 && ! 
            (e.x >= 350 && e.x <= 420 && e.y >= 225 && e.y <= 275)){
            e.xChange = 0.5;
            player.wait = e.Owait;
        }
        // going off their radius  
        if (e.x  >= 350 && e.x <= 420 && e.y === 260){
            e.xChange = 0;
            e.y = randint(225,275)
            sanc += 1;
        }
        else if (e.oldx - e.x  >= e.xArea || e.x - e.oldx >= e.xArea){
            e.xChange *= -1;
        }
    }

    //RECHARGE -----
    if (sanc != 0 && player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275){
        player.recharge -= 50
        if (player.recharge === 0){
            num -= 1
            player.recharge = 5000
        }
    } else{
        player.recharge = 5000
    }
    //SANCTUARY COORDINATES
    /*if (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275){
    }*/

    //ENEMIES  MOVEMENT
    for (let e of enemies){
        e.oldx = e.x;
        e.oldy = e.y;
        //CHANGE LOOK
        if (e.xChange != 0 || e.yChange != 0){
            e.frameX = e.n+(e.frameX + 1) % 3; 
        } 
        if (e.xChange < 0 ){
            e.frameY = 1 + e.m;
        }
        if (e.xChange > 0 ){
            e.frameY = 2+ e.m;
        }
        if (e.yChange > 0 ){
            e.frameY = 0 + e.m;
        }
        if (e.yChange < 0 ){
            e.frameY = 3 + e.m ;
        }
        
        e.x += e.xChange;
        e.y += e.yChange;           
        
        // going off the screen 
        if (e.x + e.width >= canvas.width){
            e.x -= 5;
            e.xChange = movement[randint(0, movement.length)];
        }
        if (e.x <= 0){
            e.x += 5;
            e.xChange = movement[randint(0, movement.length-1)];
        }
        if (e.y + e.height >= canvas.height ){
            e.y -= 5;
            e.yChange = movement[randint(0, movement.length-1)];
        }
        if ( e.y < 0 ){
            e.y += 5;
            e.yChange = movement[randint(0, movement.length-1)];
        }
    }
    
    //Handle key presses
    if (moveRight) {
        player.x += player.xChange;
        player.frameY = 2;
    }
    if (moveUp) {
        player.y -= player.xChange;
        player.frameY = 3;
    } 
    if (moveDown) {
        player.y += player.xChange;
        player.frameY = 0;
    } 
    if (moveLeft) {
        player.x -= player.xChange;
        player.frameY = 1;
    }
    if (sounds){
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
    if (fire){
        bulletMusic.play();  
    }
                            /************COLLISIONS************/
    //OBSTACLES -- PLAYER
    for (let o of obstacles){
        if (player_collides_obs(player, o)){
            if (face_obs === 'top'){
                player.y = o.y - player.height - 2;
            }
            if (face_obs === 'bottom'){ 
                player.y = o.y + o.height + 2;
            }
            if (face_obs === 'left'){
                player.x = o.x - player.width - 2;
            }
            if (face_obs === 'right'){
                player.x = o.x + o.width + 2;
            }
            if (player.oldx - player.x != 0 || player.oldy - player.y != 0){
                obstacleMusic.play();
            }
        }
    }     
    for (let e of enemies){
        //ENEMIES COLLIDING WITH OBSTACLES
        for (let o of obstacles){
            if (player_collides_obs(e, o) && e.fly === 1){
                //do nothing
            }
            if (player_collides_obs(e, o) && e.fly === 0){
                if (face_obs === 'top'){
                    e.y = e.oldy - 10;
                }
                if (face_obs === 'bottom'){
                    e.y = e.oldy + 10;
                }
                if (face_obs === 'left'){
                    e.x = e.oldx - 10;
                }
                if (face_obs === 'right'){
                    e.x = e.oldx + 10;
                }
                if (sanc >= 5 ){
                    if (e.xChange < 0){
                        //e.xChange = Movement[randint(8, 15)];
                        e.xChange = Movement[randint(0, Movement.length-1)];
                    }
                    if (e.yChange < 0){
                        e.yChange = Movement[randint(0, Movement.length-1)];
                    }
                    if (e.xChange > 0){
                        e.xChange = Movement[randint(0, Movement.length-1)];
                    }
                    if (e.yChange > 0){
                        e.yChange = Movement[randint(0, Movement.length-1)];
                    }
                } 
                if (sanc < 5){
                    if (e.xChange < 0){
                        e.xChange = movement[randint(0, movement.length-1)];
                    }
                    if (e.yChange < 0){
                        e.yChange = movement[randint(0, movement.length-1)];
                    }
                    if (e.xChange > 0){
                        e.xChange = movement[randint(0, movement.length-1)];
                    }
                    if (e.yChange > 0){
                        e.yChange = movement[randint(0, movement.length-1)];
                    }
                }
            }
        }
        //ENEMY MOVE TO PLAYER/CHASE PLAYER
            //IF PLAYER IN THE SANC
        if ((dist(e, player) <= e.xArea  || dist(player, e) <= e.xArea) && 
            (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275)){
            //do nothing
        }
        if ((dist(e, player) <= e.xArea  || dist(player, e) <= e.xArea) && !
            (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275)){
                if ( e.n === 0 || e.n === 6
                    || e.n === 1 || e.n === 7
                    || e.n === 2 || e.n === 8){
                    if (e.recharge <= 0){
                        e.x = lerp(e.x, player.x, 0.09);
                        e.y = lerp(e.y, player.y, 0.09);
                        if (player_collides(e)){
                            num += 2;
                            e.recharge = 1000;
                            if (face === 'up'){
                                player.y += 20;
                                e.y -= 100;
                            }
                            if (face === 'left'){
                                player.x += 15;
                                e.x -= 100;
                            }
                            if (face === 'down'){
                                player.y -= 20;
                                e.y += 100;
                            }
                            if (face === 'right'){
                                player.x -= 15;
                                e.x += 100;
                            }
                        }
                    }
                    //ENEMY NEUTRALISED
                }else {
                    if (e.recharge <= 0){
                        e.x = lerp(e.x, player.x, 0.09);
                        e.y = lerp(e.y, player.y, 0.09);
                        if (player_collides(e)){
                            num += 1;
                            e.recharge = 1000;
                            if (face === 'up'){
                                player.y += 20;
                                e.y -= 100;
                            }
                            if (face === 'left'){
                                player.x += 15;
                                e.x -= 100;
                            }
                            if (face === 'down'){
                                player.y -= 20;
                                e.y += 100;
                            }
                            if (face === 'right'){
                                player.x -= 15;
                                e.x += 100;
                            }
                        }
                    }
                }
            e.recharge -= 25;                
        } else {
            e.recharge = 1000;
        }
    }
    //BULLETS HITTING ENEMY 
    for (let b of bullets){
        for (let e of enemies){
            //IF ENEMY IS HIT W/ BULLET
            if (bullets_collides(b, e)){
                if (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275){
                }
                else{
                    e.hit += 1;
                    if ( e.n === 0 || e.n === 6
                        || e.n === 1 || e.n === 7
                        || e.n === 2 || e.n === 8){
                        e.n += 3;
                    }
                    if (e.hit === 3){
                        score += 5;
                        kills += 1;
                        enemies.splice(enemies.indexOf(e), 1);
                        bullets.splice(bullets.indexOf(b), 1);
                        break;
                    }                
                    if (e.xChange < 0 || e.yChange < 0){
                        e.xChange += 0.25;
                        e.yChange += 0.25;
                    } else{
                        e.xChange -= 0.25;
                        e.yChange -= 0.25;
                    }
                    bullets.splice(bullets.indexOf(b), 1);
                }
            }
        }
    }

    // /************PATHWAYSSSS************/
    //up left
    if (player.x + player.width < 15*tileSize && player.x >= 13*tileSize && player.y < 0){
        player.y = canvas.height - player.height;
        player.x = 5*tileSize; 
    } // up right
    if (player.x <= 16*tileSize && player.x + player.width > 15*tileSize && player.y < 0){
        player.y = canvas.height - player.height;
        player.x = canvas.width - 6.5*tileSize; 
    } //down left
    if ((player.x <= 8*tileSize) && (player.x >= 4*tileSize) && player.y + player.height > canvas.height){
        player.y = player.height*2;
        player.x = 14*tileSize;
    } // down right
    if ((player.x <= canvas.width - 5*tileSize) && (player.x >= canvas.width - 9*tileSize) && player.y + player.height > canvas.height ){
        player.y = player.height*2;
        player.x = 15.5*tileSize;
    } //going off top left to right
    if (player.x < 0 && (player.y + player.height >= tileSize*8) && (player.y + player.height <= tileSize*10)){
        player.x = canvas.width - player.width -5;
        player.y = tileSize*8;
    } //going off top right to left
    if (player.x + player.width >= canvas.width && (player.y + player.height >= tileSize*8) && (player.y <= tileSize*11.5)){
        player.x = player.width;
        player.y = tileSize*8;
    }//mid left to right
    if (player.x < 0 && (player.y <= canvas.height - tileSize*8) && (player.y >= canvas.height - tileSize*9)){
        player.x = canvas.width - player.width -0.9;
        player.y = canvas.height - tileSize*8;
    } //mid right to left
    if (player.x + player.width >= canvas.width && (player.y <= canvas.height - tileSize*8) && (player.y >= canvas.height - tileSize*9)){
        player.x =  player.width + 0.9;
        player.y = canvas.height - tileSize*8;
    }//bot left to right
    if (player.x < 0 && (player.y <= canvas.height - tileSize*1) && (player.y >= canvas.height - tileSize*3)){
        player.x = canvas.width - player.width -0.9;
        player.y = canvas.height - tileSize*2;
    } //bot right to left
    if (player.x + player.width >= canvas.width && (player.y <= canvas.height - tileSize*1) && (player.y >= canvas.height - tileSize*3)){
        player.x =  player.width;
        player.y = canvas.height - tileSize*2;
    }//mid left to right
    if (player.x < 0 && (player.y <= canvas.height - tileSize*9) && (player.y >= canvas.height - tileSize*11.5)){
        player.x = canvas.width - player.width -0.9;
        player.y = canvas.height - tileSize*11;
    } //mid right to left
    if (player.x + player.width >= canvas.width && (player.y <= canvas.height - tileSize*9) && (player.y >= canvas.height - tileSize*11.5)){
        player.x =  player.width + 0.9;
        player.y = canvas.height - tileSize*11;
    }
    //Going off left 
    if (player.x < 0){
        player.x = 0; //-randint(0, canvas.width);
    } //going right
    if (player.x + player.width > canvas.width){
        player.x = canvas.width - player.width; //-randint(0, canvas.width) 
    }
    //Going up
    if (player.y < 0 ){
        player.y = 0;
    }//going down
    if (player.y + player.height >= canvas.height){
        player.y = canvas.height - player.height;
    }
    
    //IF PLAYER GETS THE POWERUP
    for (let random of powerup){
        if (powerup_collides(random)){
                /* https://love2dev.com/blog/javascript-remove-from-array/ */
            powerup.splice(powerup.indexOf(random), 1);
            num -= 3;
            manaMusic.play()
        }
    }
    if (score >= 1000 || sanc === 50){
        stop();
    }
}

function gameover(){
    context.fillStyle = 'black';
    context.fillRect(128, 210, 211, 75);
    context.font = '30px Courier New';
    context.fillStyle = 'white';
    context.fillText('Game Over!', 145, 250);
}

function drawLife(stat){
    for (let f of stat){
        context.drawImage(f_life, 
        f.width*f.frameX, f.height*f.frameY, f.width, player.height,
        f.x, f.y, f.width, f.height);
    }
}

/* https://github.com/mattdesl/lerp/blob/master/index.js*/
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t;
}

function enemy_shoot(){
    for (let e of enemies){
        if (face === 'right' && fire && e.bullets.length < b_c ) { //
            let b = {
                x : e.x+ e.width,
                y : e.y + e.height/2 - bo.ysize/2,
                yChange : 0,
                xChange : 10,
                xsize : bo.xsize,
                ysize : bo.ysize
            };
            bullets.push(b);
        }
        if (face === 'left' && fire && bullets.length < b_c) {
            let b = {
                x : e.x - bo.xsize,
                y : e.y + e.height/2 - bo.ysize/2,
                xChange : -10,
                yChange : 0,
                xsize : bo.xsize,
                ysize : bo.ysize
            };
            bullets.push(b);
        } 
        if (face === 'down' && fire && bullets.length < b_c) {
            let b = {
                x : e.x + (e.width/2) - bo.ysize/2,
                y : e.y + e.height,
                xChange : 0,
                yChange : 10,
                xsize : bo.ysize,
                ysize : bo.xsize
            };
            bullets.push(b);
        } 
        if (face === 'up' && fire && bullets.length < b_c) {
            let b = { 
                x : e.x + e.width/2 - bo.ysize/2,
                y : e.y - bo.xsize,
                xChange : 0,
                yChange : -10,
                xsize : bo.ysize,
                ysize : bo.xsize
            };
            bullets.push(b); 
        }
    }
}


function activate(event){
    let key = event.key;
    if (key === 'ArrowLeft' || key === 'a'){
        moveLeft = true;
        face = 'left';
        moveRight = false;
        moveUp = false;
        moveDown = false;
    } else if (key === 'ArrowUp' || key === 'w'){
        moveUp = true;
        face = 'up';
        moveLeft = false;
        moveRight = false;
        moveDown = false;
    } else if (key === 'ArrowDown' || key === 's'){
        moveDown = true;
        face = 'down';
        moveLeft = false;
        moveUp = false;
        moveRight = false;
    } else if (key === 'ArrowRight' || key === 'd'){
        moveRight = true;
        face = 'right';
        moveLeft = false;
        moveUp = false;
        moveDown = false;
    }  else if (key === " "){ 
        if (player.x >= 345 && player.x <= 425 && player.y >= 230 && player.y <= 275){
            fire = false;
        }else{
            fire = true;
        if (face === 'right' && fire && bullets.length < b_c ) { //
            let b = {
                x : player.x+ player.width,
                y : player.y + player.height/2 - bo.ysize/2,
                yChange : 0,
                xChange : 10,
                xsize : bo.xsize,
                ysize : bo.ysize
            };
            bullets.push(b);
        }
        if (face === 'left' && fire && bullets.length < b_c) {
            let b = {
                x : player.x - bo.xsize,
                y : player.y + player.height/2 - bo.ysize/2,
                xChange : -10,
                yChange : 0,
                xsize : bo.xsize,
                ysize : bo.ysize
            };
            bullets.push(b);
        } 
        if (face === 'down' && fire && bullets.length < b_c) {
            let b = {
                x : player.x + (player.width/2) - bo.ysize/2,
                y : player.y + player.height,
                xChange : 0,
                yChange : 10,
                xsize : bo.ysize,
                ysize : bo.xsize
            };
            bullets.push(b);
        } 
        if (face === 'up' && fire && bullets.length < b_c) {
            let b = { 
                x : player.x + player.width/2 - bo.ysize/2,
                y : player.y - bo.xsize,
                xChange : 0,
                yChange : -10,
                xsize : bo.ysize,
                ysize : bo.xsize
            };
            bullets.push(b); 
            }
        }
        
    } else if (key === 'z'){
        if (player.xChange <= 7 || player.yChange <= 7){
            player.xChange += 0.5;
            player.yChange += 0.5;
        } else{
            player.xChange = 7;
            player.yChange = 7;
        }
    } else if (key === 'x'){
        if (player.xChange >= 1 || player.yChange >= 1){
            player.xChange -= 0.5;
            player.yChange -= 0.5;
        } else{
            player.xChange = 1;
            player.yChange = 1;
        }
    } else if (key === 'm'){
        if (sounds === true){
            sounds = false;
        } else{
            sounds = true;
        }
    } else if (key === 'q'){
        stop();
    }else if (key === 'c'){
        if (e_c >= 15){
            e_c = 15;
        }else{
            e_c += 1;
        }
    }else if (key === 'v'){
        if (e_c != 1){
            e_c -= 1;
            enemies.pop();
        }else{
            e_c = 1;
        }
    }

}

function deactivate(event){
    let key = event.key;
    if (key === 'ArrowLeft' || key === 'a'){
        moveLeft = false;
    } else if (key === 'ArrowUp' || key === 'w'){
        moveUp = false;
    } else if (key === 'ArrowDown' || key === 's'){
        moveDown = false;
    } else if (key === 'ArrowRight' || key === 'd'){
        moveRight = false;
    } else if (key === " "){
        fire = false;
    }
}

function randint(min, max){
    return Math.round(Math.random() * (max-min) + min )
}
function powerup_collides(a){
    if (player.x + player.width < a.x ||     
        a.x + a.size < player.x ||          
        player.y > a.y + a.size ||          
        a.y > player.y + player.height){      
            return false;//non-collision
    }else{
        return true;
    }
}

function tp_collides(t, a){
    if (t.x + t.width < a.x ||     
        a.x + a.width < t.x ||          
        t.y > a.y + a.height ||          
        a.y > t.y + t.height){      
            return false;//non-collision
    }else{
        return true;
    }
}

function bullets_collides(b, e){
    if (b.x + b.xsize < e.x ||     
        e.x + e.width < b.x ||          
        b.y > e.y + e.height ||          
        e.y > b.y + b.ysize){      
            return false;//non-collision
    }else{
        return true;
    }

}

function player_collides(a){
    if (player.x + player.width < a.x ||     
        a.x + a.width < player.x ||          
        player.y > a.y + a.height ||          
        a.y > player.y + player.height){      
            return false;//non-collision
    }else{
        return true;
    }
}

function player_collides_obs(o,a){
    if (o.x + o.width < a.x ||     
        a.x + a.width < o.x ||          
        o.y > a.y + a.height ||          
        a.y > o.y + o.height){      
            return false;//non-collision
    }else{//right of tile
        if (o.x <= a.x + a.width && o.x + 5 >= a.x + a.width /*&&
            o.y + o.height > a.y && o.y < a.y + a.height*/){ 
            face_obs = 'right';
        }//left
        if (o.x + o.width > a.x && o.x <= a.x /*&& 
           o.y + o.height > a.y && o.y < a.y + a.height*/){
            face_obs = 'left';
        }//bottom
        if (o.y <= a.y + a.height && o.y + o.height>= a.y + a.height /*&& 
            o.x + o.width > a.x && o.x + o.width < a.x + a.width*/){
            face_obs = 'bottom'; 
        }//up
        if (/*o.x + o.width > a.x && o.x < a.x + a.width
            &&*/ o.y + o.height >= a.y && o.y <= a.y){
            face_obs = 'top';
        }
        return true;
    }
}

function dist(p,q){
    return Math.pow((Math.pow((q.x - p.x), 2) + Math.pow((q.y - p.y), 2)), 0.5)
}

function coord(event){ 
    console.log("X:", event.clientX, "Y:", event.clientY);
}

function stop(){
    gameover();
    hide.style.visibility = 'visible';
    backgroundMusic.pause()
    window.removeEventListener('keydown', activate, false);
    window.cancelAnimationFrame(request_id);
    sounds = false;

    let data = new FormData();     
    data.append("score", score);
    data.append("sanc", sanc);
    data.append('kills', kills);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/~rzb1/cgi-bin/ca2/run.py/store_score", true); /*~rzb1/cgi-bin/ca2/run.py/store_score*/
    xhttp.send(data); 
}



function handle_response(){
    //Check that the response has fully arrived
    if (xhttp.readyState === 4){
        //Check the request was succesful
        if (xhttp.status === 200){
            if (xhttp.responseText === "success"){
                // score was successfully stored in database
            } else {
                // score was not successfully stored in database
            }
        }
    }
}

async function load_images(urls){
    let promises = [];
    for (let url of urls){
        promises.push(new Promise(resolve => {
            let img = new Image();
            img.onload = resolve;
            img.src = url;
        }));
    }
    await Promise.all(promises);
}

async function load_audio(urls){
    let promises = [];
    for (let url of urls){
        promises.push(new Promise(resolve => {
            let audio = new Audio();
            audio.onload = resolve;
            audio.src = url;
        }));
    }
    await Promise.all(promises);
}

