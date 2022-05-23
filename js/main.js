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
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.lastConstellation = 0;
        this.nextConstellation = Math.random() * 3000;
        this.constellation = {
            stars: [],
            isClosed: false,
            width: null,
        }
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
                speed: (Math.random() + 0.01) / 2,
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

    updateConstellation() {
        if (this.constellation.width > 0) {
            this.constellation.width -= 0.05;
        } else this.constellation.width = 0;
    }

    generateRandomConstellation() {
        const x = (this.width / 2) + Math.random() * 0.8 * this.width - this.width / 2;
        const y = (this.height / 2) + Math.random() * 0.8 * this.height - this.height / 2;
        const radius = (this.height / 2) * Math.random() * 0.5 + 0.5;

        this.constellation = {
            stars: this.stars.filter(star => {
                return star.x > x - radius &&
                    star.x < x + radius &&
                    star.y > y - radius &&
                    star.y < y + radius;
            }).slice(0, Math.round(Math.random() * 7 + 3)),
            isClosed: Math.random() > 0.5,
            width: 5,
        }
    }

    drawConstellation() {
        const {
            stars,
            isClosed,
            width
        } = this.constellation;
        const strasCount = stars.length;

        if (strasCount > 2) {

            const firstStar = stars[0];

            this.ctx.beginPath();
            this.ctx.moveTo(firstStar.x, firstStar.y);
            this.ctx.lineTo(stars[1].x, stars[1].y);

            for (let i = 1; i < strasCount - 1; i++) {
                const nextStar = stars[i + 1];
                this.ctx.lineTo(nextStar.x, nextStar.y);
            }

            if (isClosed) {
                this.ctx.lineTo(firstStar.x, firstStar.y);
            }

            this.ctx.strokeStyle = "#f7eada";
            this.ctx.lineWidth = width;
            this.ctx.stroke();
        }

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

    draw(now) {
        this.clearCanvas();
        this.drawStars();
        this.updateStars();
        this.drawConstellation();
        this.updateConstellation();
        this.drawOverlayer();
if (now - this.lastConstellation > this.nextConstellation) {
    this.lastConstellation = now;
    this.nextConstellation = Math.random() * 1000 + 2000;
    this.generateRandomConstellation();

}

window.requestAnimationFrame((now) => this.draw(now));
    }

    run() {
        this.initCanvas();
        this.generateStars(500);
        this.draw(0);
    }
}

const sky = new Sky(canvas);
sky.run()
