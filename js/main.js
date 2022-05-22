import '../css/style.css'

const canvas = document.querySelector('#canvas');

// ctx.fillStyle = '#ff0000'
// ctx.fillRect(0, 0, 100, 50);
// ctx.strokeStyle = '#00ff00'
// ctx.beginPath();
// ctx.lineWidth = 3;
// ctx.moveTo(50, 50);
// ctx.lineTo(100, 100);
// ctx.lineTo(200, 150);
// ctx.closePath();
// ctx.stroke();

class Sky {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    generateStars(count) {
        const stars = [];

        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 3 + 2;
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius,
                orginalRadius: radius,
                color: '#fff',
                speed: (Math.random() + 0.01) / 5,
            })
        }

        this.stars = stars;
    }

    drawOverlayer() {
        let gradient = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 250, this.width / 2, this.height / 2, this.width / 2);

        gradient.addColorStop(0, `rgba(0,0,0,0)`);
        gradient.addColorStop(1, `rgba(0,0,0,0.75)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    updateStars() {
        this.stars.forEach(star => {
            star.x += star.speed;
            star.y -= star.speed * ((this.width / 2) - star.x) / 3000;
            star.radius = star.orginalRadius * (Math.random() / 4 + 0.9);
            if (star.x > this.width + 2 * star.radius) {
                star.x = -2 * star.radius;
            }
        });
    }

    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars() {
        this.stars.forEach(star => {
            this.drawStar(star)
        })
    }

    drawStar(star) {
        this.ctx.save()
        this.ctx.fillStyle = star.color;
        this.ctx.beginPath();
        this.ctx.translate(star.x, star.y);
        this.ctx.moveTo(0, 0 - star.radius);

        for (let i = 0; i < 5; i++) {
            this.ctx.rotate((Math.PI / 180) * 36);
            this.ctx.lineTo(0, 0 - star.radius * 0.5);
            this.ctx.rotate((Math.PI / 180) * 36);
            this.ctx.lineTo(0, 0 - star.radius)
        }
        this.ctx.fill();
        this.ctx.restore()
    }

    draw() {
        this.clearCanvas();
        this.drawStars();
        this.updateStars();
        this.drawOverlayer();
        window.requestAnimationFrame(() => this.draw());
    }

    run() {
        this.initCanvas();
        this.generateStars(500);
        this.draw();
    }
}

const sky = new Sky(canvas);
sky.run()
