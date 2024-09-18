class Powerup {

    static powerups = [];
    static options = ['bomb', 'shrink'];
    static images = {
        bomb: 'Images/Bomb.png',
        shrink: 'Images/Shrink.png'
    }

    constructor() {
        this.x = Math.random() * window.innerWidth*0.75 + window.innerWidth * 0.25;
        this.y = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
        this.ogRadius = 40;
        this.radius = this.ogRadius;
        this.angle = 0;
        this.option = Powerup.options[Math.floor(Math.random() * Powerup.options.length)];
        this.rotationSpeed = Math.PI*2/8*Math.random()*0.5+0.5;
        this.img = new Image();
        this.img.src = Powerup.images[this.option];
        this.player = null;
        Math.random() < 0.5 ? this.rotationSpeed *= -1 : this.rotationSpeed *= 1;
        this.timeSinceCreated = 0;

        Powerup.powerups.push(this);
    }

    static updatePowerups() {
        for(let i = 0; i < this.powerups.length; i++) {
            if(this.powerups[i].update()) {
                i--;
            }
        }
    }

    update() {
        this.timeSinceCreated += deltaTime;
        
        if(this.timeSinceCreated > 10) {
            Powerup.powerups.splice(Powerup.powerups.indexOf(this), 1);
            return true;
        }
        this.angle += this.rotationSpeed * deltaTime;
        if(this.player != null) {
            this.timeSinceCreated = 0;
            this.x = window.innerWidth * 0.27 + this.radius;
            this.angle = 0;
            let adjust = -1;
            if(this.player.num == 2) {
                adjust = 1;
            }
            this.y = window.innerHeight/2 + window.innerHeight * 0.45 * adjust;
        } else {
            this.radius = this.ogRadius-(Math.cos(this.timeSinceCreated*(Math.PI))+1)*10;
        }
        this.draw();
    }

    draw() {
        Canvas.glow(this.x, this.y, this.radius*1);
        Canvas.drawWithAngle(this.x, this.y, this.angle, this.img, this.radius);
    }

    assign(player) {
        this.player = player;
        player.powerup = this;
    }

    use() {
        if(this.option == 'bomb') {
            for(let i = 0; i < Asteroid.asteroids.length; i++) {
                let asteroid = Asteroid.asteroids[i];
                let bombRadius = 200;
                if((this.player.x - asteroid.x)**2 + (this.player.y - asteroid.y)**2 < (bombRadius)**2) {
                    Asteroid.asteroids.splice(i, 1);
                    i--;
                }
                let x = this.player.x;
                let y = this.player.y;
                Canvas.animations.push({
                    framesLeft: 10,
                    func: function() {
                        ctx.fillStyle = 'rgba(255, 100, 100, 0.2)';
                        ctx.beginPath();
                        console.log(bombRadius + 0.1-(bombRadius/25)*(this.framesLeft-5)**2);
                        ctx.arc(x, y, bombRadius + 0.1-(bombRadius/25)*(this.framesLeft-5)**2, 0, 2*Math.PI);
                        ctx.fill();
                    }
                });
            }
        } else if(this.option == 'shrink') {
            this.player.shrinking = 0;
        }

        this.player.powerup = null;
        Powerup.powerups.splice(Powerup.powerups.indexOf(this), 1);
    }
}