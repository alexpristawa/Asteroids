const keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    i: false,
    j: false,
    k: false,
    l: false,
    LShift: false,
    ';': false,
    'c': false,
    'm': false
};
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const stars = document.querySelector('canvas#stars');
const starsctx = stars.getContext('2d');

let ww = window.innerWidth;
let wh = window.innerHeight;

let factor = window.devicePixelRatio;
canvas.height = window.innerHeight*factor;
canvas.width = window.innerWidth*factor;
stars.height = window.innerHeight * factor;
stars.width = window.innerWidth * factor;

ctx.scale(factor, factor);
starsctx.scale(factor, factor);

Background.withGlow();

for(let i = 0; i < 2000; i++) {
    starsctx.lineWidth = 0;
    starsctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
    starsctx.beginPath();
    starsctx.arc(Math.random()*window.innerWidth, Math.random()*window.innerHeight, 0.5, 0, 2*Math.PI);
    starsctx.fill();
}


class Player {
    static p1;
    static p2;
    static movement = 'velocity';

    constructor(num) {
        this.x = window.innerWidth/7;
        this.y = window.innerHeight/2 + (num-1.5) * window.innerHeight/1.5;
        this.img0 = new Image();
        this.img1 = new Image();
        this.img2 = new Image();
        this.imgBoost = new Image();
        this.img0.src = 'ufo_0.png';
        this.img1.src = 'ufo_1.png';
        this.img2.src = 'ufo_2.png';
        this.imgBoost.src = 'ufo_boost.png';
        this.num = num;
        this.ogRadius = 30;
        this.radius = this.ogRadius;
        this.timeOfMovement = 0;
        this.boostDiv = document.querySelector(`#p${this.num} > div`);
        this.boost = 0;
        this.human = null;
        this.score = 0;
        this.boostedPreviousFrame = false;
        this.triedBoostingPreviousFrame = false;
        this.powerup = null;

        this.yVelocity = 0;
        this.xVelocity = 0;
        this.maxVelocity = 3;

        if(this.num == 1) {
            Player.p1 = this;
            this.planetX = 0;
            this.planetY = 0;
        } else {
            this.planetX = 0;
            this.planetY = window.innerHeight;
            Player.p2 = this;
            this.opp = Player.p1;
            Player.p1.opp = this;
        }

        if(this.num == 1) {
            this.keybinds = {
                up: 'w',
                down: 's',
                left: 'a',
                right: 'd',
                boost: 'LShift',
                powerup: 'e'
            };
        } else {
            this.keybinds = {
                up: 'i',
                down: 'k',
                left: 'j',
                right: 'l',
                boost: ' ',
                powerup: 'u'
            }
        }
    }

    static updatePlayers() {
        Player.p1.update();
        if(Player.p2) Player.p2.update();
    }

    update() {
        if(this.shrinking != undefined) {
            this.shrinking += deltaTime;
            if(this.shrinking < 0.5) {
                this.radius = this.ogRadius - this.ogRadius * this.shrinking;
            } else if(this.shrinking > 6.5 && this.shrinking < 7) {
                this.radius = this.ogRadius - this.ogRadius * (7-this.shrinking);
            } else if(this.shrinking > 7) {
                this.shrinking = undefined;
                this.radius = this.ogRadius;
            }
        }
        if(this.deadTime != undefined) {
            this.deadTime += deltaTime;
            this.boostDiv.style.width = `${this.deadTime/6*100}%`;
            if(this.deadTime < 6) return;
            this.boost = 2;
            this.x = window.innerWidth/7;
            this.y = window.innerHeight/2 + (this.num-1.5) * window.innerHeight/1.5;
            for(let i = 0; i < Asteroid.asteroids.length; i++) {
                let asteroid = Asteroid.asteroids[i];
                if((this.x-asteroid.x)**2 + (this.y-asteroid.y)**2 < (this.radius*6 + asteroid.radius)**2) {
                    Asteroid.asteroids.splice(Asteroid.asteroids.indexOf(asteroid), 1);
                    i--;
                }
            }
            this.deadTime = undefined; 
        }
        this.timeOfMovement += deltaTime;
        this.boost = Math.min(2, this.boost + deltaTime/4);
        let boostMultiplier = 1;
        this.boosting = false;
        if(keyboard[this.keybinds.boost] && (this.boost > deltaTime*30 || ((!this.triedBoostingLastFrame || this.boostedPreviousFrame) && this.boost > deltaTime))) {
            this.boosting = true;
            this.boost -= deltaTime;
            boostMultiplier = 2;
            this.boostedPreviousFrame = true;
        } else {
            this.boostedPreviousFrame = false;
        }
        this.boostDiv.style.width = `${100 * this.boost/2}%`;

        if(keyboard[this.keybinds.boost]) {
            this.triedBoostingLastFrame = true;
        } else {
            this.triedBoostingLastFrame = false;
        }

        if(keyboard[this.keybinds.powerup]) {
            if(this.powerup != null) {
                this.powerup.use();
            }
        }

        //Checks human collision
        if(Human.human && (this.x-Human.human.x)**2 + (this.y-Human.human.y)**2 < (this.radius + Human.human.radius)**2 && Human.human.player == null) {
            Human.human.player = this;
            this.human = Human.human;
            Human.human.timeSinceLastTransfer = 0;
        }

        // Checks for collision with another spaceship and if that spaceship has a human
        if (this.opp.human != null && this.opp.human.timeSinceLastTransfer > 0.1 && (this.x - this.opp.x) ** 2 + (this.y - this.opp.y) ** 2 < (this.radius + this.opp.radius) ** 2) {
            // Transfer the human
            this.human = this.opp.human;
            this.opp.human = null;
            this.human.player = this;
            this.human.timeSinceLastTransfer = 0;

            // Calculate the vector between the centers
            let dx = this.x - this.opp.x;
            let dy = this.y - this.opp.y;

            // Calculate the distance (hypotenuse) between the two spaceships
            let distance = Math.sqrt(dx ** 2 + dy ** 2);

            // Normalize the vector (dx, dy) and scale it so the total velocity has a magnitude of 5
            let normalized_dx = dx / distance;
            let normalized_dy = dy / distance;

            // Set the velocity such that the hypotenuse (speed) is 5
            let velocity = this.maxVelocity * 5; // Hypotenuse of the velocity
            this.xVelocity = normalized_dx * velocity;
            this.yVelocity = normalized_dy * velocity;

            // Opposite direction for the other spaceship
            this.opp.xVelocity = -normalized_dx * velocity;
            this.opp.yVelocity = -normalized_dy * velocity;
        }

        if(this.human != null) {
            if((this.x-this.planetX)**2 + (this.y-this.planetY)**2 < (this.radius + window.innerHeight*0.2)**2) {
                this.human = null;
                Human.human = null;
                this.score++;
                document.getElementById(`p${this.num}Score`).innerHTML = this.score;
            }
        }

        //Moves the player
        if(Player.movement == 'position') {
            if(keyboard[this.keybinds.up]) {
                this.y -= this.maxVelocity*boostMultiplier;
            }
            if(keyboard[this.keybinds.down]) {
                this.y += this.maxVelocity*boostMultiplier;
            }
            if(keyboard[this.keybinds.left]) {
                this.x -= this.maxVelocity*boostMultiplier;
            }
            if(keyboard[this.keybinds.right]) {
                this.x += this.maxVelocity*boostMultiplier;
            }
            if(keyboard[this.keybinds.up] == keyboard[this.keybinds.down] && keyboard[this.keybinds.left] == keyboard[this.keybinds.right]) {
                this.timeOfMovement = 0;
            }
        } else {
            let acc = 1.5*boostMultiplier;
            if(keyboard[this.keybinds.up]) {
                this.yVelocity -= acc;
            } else if (this.yVelocity < 0) {
                this.yVelocity = Math.min(0, this.yVelocity + acc/4);
            }
            if(keyboard[this.keybinds.down]) {
                this.yVelocity += acc;
            } else if(this.yVelocity > 0) {
                this.yVelocity = Math.max(0, this.yVelocity - acc/4);
            }

            if(Math.abs(this.yVelocity) > this.maxVelocity*boostMultiplier) this.yVelocity = Math.max(this.maxVelocity * boostMultiplier, Math.abs(this.yVelocity) - acc*boostMultiplier*1.5) * Math.sign(this.yVelocity);
        
            if(keyboard[this.keybinds.left]) {
                this.xVelocity -= acc;
            } else if(this.xVelocity < 0) {
                this.xVelocity = Math.min(0, this.xVelocity + acc/4);
            }
            if(keyboard[this.keybinds.right]) {
                this.xVelocity += acc;
            } else if(this.xVelocity > 0) {
                this.xVelocity = Math.max(0, this.xVelocity - acc/4);
            }

            if(Math.abs(this.xVelocity) > this.maxVelocity*boostMultiplier) this.xVelocity = Math.max(this.maxVelocity * boostMultiplier, Math.abs(this.xVelocity) - acc*boostMultiplier*1.5) * Math.sign(this.xVelocity);

            this.x += this.xVelocity;
            this.y += this.yVelocity;

            let cd = this.radius * 0.8;
            if(keyboard[this.keybinds.up] == keyboard[this.keybinds.down] && keyboard[this.keybinds.left] == keyboard[this.keybinds.right]) {
                this.timeOfMovement = 0;
            }
            if(this.x < cd) this.x = cd;
            if(this.x > window.innerWidth - cd) this.x = window.innerWidth - cd;
            if(this.y < cd) this.y = cd;
            if(this.y > window.innerHeight - cd) this.y = window.innerHeight - cd;
        }

        //Checks asteroid collisions
        Asteroid.asteroids.forEach(obj => {
            if((this.x-obj.x)**2 + (this.y+this.radius/10-obj.y)**2 < (this.radius+obj.radius-this.radius/2)**2) {
                this.deadTime = 0;
                this.timeOfMovement = 0;
                this.human = null;
                if(Human.human != null) {
                    if(Human.human.player == this) {
                        Human.human.player = null;
                        Human.human.y = Math.min(window.innerHeight-Human.human.radius, Human.human.y);
                    }
                }
            }
        });

        for(let i = 0; i < Powerup.powerups.length; i++) {
            let p = Powerup.powerups[i];
            if(this.powerup == null && p.timeSinceCreated > 0 && (this.x-p.x)**2 + (this.y-p.y)**2 < (this.radius + p.radius)**2) {
                p.assign(this);
            }
        }

        //Draws the player
        if(this.boosting) {
            ctx.drawImage(this.imgBoost, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
        } else if(this.timeOfMovement > 0.5) {
            ctx.drawImage(this.img2, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
        } else if(this.timeOfMovement > 0) {
            ctx.drawImage(this.img1, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
        } else {
            ctx.drawImage(this.img0, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
        }
    }
}

class Human {

    static human;
    static sources = [
        "Alex",
        "Brayden",
        "Emily",
        "Jill",
        "Kamala",
        "Lily",
        "Michael Jackson",
        "Rylan",
        "Trump"
    ];
    static timeSinceLastHuman = 0;

    constructor() {
        this.radius = 40;
        this.x = Math.random() * (window.innerWidth/2-this.radius*2) + window.innerWidth/2+this.radius;
        this.y = Math.random() * (window.innerHeight-this.radius*2) + this.radius;
        this.img = new Image();
        this.img.src = `Humans/${Human.sources[Math.floor(Math.random() * Human.sources.length)]}.png`;
        this.player = null;
        this.timeSinceLastTransfer = 1;
        Human.human = this;
    }

    static updateHuman() {
        if(Human.human) {
            Human.human.update();
        } else {
            Human.timeSinceLastHuman += deltaTime;
            if(Human.timeSinceLastHuman >= 1) {
                new Human();
                Human.timeSinceLastHuman = 0;
            }
        }
    }

    update() {
        this.timeSinceLastTransfer += deltaTime;
        if(this.player) {
            this.x = this.player.x;
            this.y = this.player.y + this.player.radius + this.radius + 10;
        }
        // Calculate the aspect ratio
        let aspectRatio = this.img.width / this.img.height;

        // Calculate the new width based on the aspect ratio and fixed height
        let newHeight = this.radius * 2;
        let newWidth = newHeight * aspectRatio;

        // Draw the image with the new width and height
        ctx.drawImage(this.img, this.x - newWidth / 2, this.y - newHeight / 2, newWidth, newHeight);
    }
}

class Asteroid {

    static asteroids = [];

    constructor() {
        this.y = Math.random() * window.innerHeight;
        this.angle = Math.random() * 2 * Math.PI;
        this.img = new Image();
        this.img.src = 'asteroid.png';
        this.radius = Math.random()**2 * 40 + 20;
        this.x = window.innerWidth + this.radius;
        this.speed = Math.random() * 1.5 + 0.5;
        Asteroid.asteroids.push(this);

        this.angleDirection = Math.sign(Math.random()-0.5);
    }

    static updateAsteroids() {
        for(let i = 0; i < Asteroid.asteroids.length; i++) {
            if(Asteroid.asteroids[i].update()) {
                i--;
            }
        }
    }

    update() {
        this.x -= this.speed;
        if(this.x < -this.radius) {
            Asteroid.asteroids.splice(Asteroid.asteroids.indexOf(this), 1);
            return true;
        }
        this.angle += this.speed/100*this.angleDirection;
        Canvas.drawWithAngle(this.x, this.y, this.angle, this.img, this.radius*2)
    }
}

new Player(1);
new Player(2)


document.addEventListener('keydown', (event) => {
    keyboard[event.key.toLowerCase()] = true;
    if(event.key == "Shift") {
        if(event.location == 1) {
            keyboard['LShift'] = true;
        }
    }
});

document.addEventListener('keyup', (event) => {
    keyboard[event.key.toLowerCase()] = false;
    if(event.key == "Shift") {
        if(event.location == 1) {
            keyboard['LShift'] = false;
        }
    }
});

document.addEventListener('mousedown', (event) => {
    if((event.clientX)**2 + (event.clientY-window.innerHeight)**2 < (window.innerHeight*0.2)**2) {
        document.getElementById('planet2').remove();
        document.getElementById('p2Holder').remove();
        Player.p2 = null;
        Player.respawnTime=0;
    }
});


let deltaTime;
let previousTime;
let timeElapsed = 0;
let animation = function() {
    if(previousTime == undefined) {
        previousTime=Date.now();
        requestAnimationFrame(animation);
        return;
    }
    deltaTime = (Date.now()-previousTime)/1000;
    previousTime = Date.now();
    timeElapsed += deltaTime;

    if(Math.random()*200 < Math.min(18, 5 + timeElapsed/40)) {
        new Asteroid();
    }

    if(Math.random() < 1/(60*10)) {
        new Powerup();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Player.updatePlayers();
    Asteroid.updateAsteroids();
    Human.updateHuman();
    Powerup.updatePowerups();


    Canvas.drawQueue();
    requestAnimationFrame(animation);
}

requestAnimationFrame(animation);