/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = "20px Arial";

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
    this.speedX;
    this.speedY;
    this.rad = 1;
    this.speedModifier = Math.floor(Math.random() * 5 + 1);
    this.angle = 0;
    this.hue = 340;
  }
  draw(ctx) {
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    let x = Math.floor(this.x / this.effect.cellSize);
    let y = Math.floor(this.y / this.effect.cellSize);
    let index = y * this.effect.cols + x;
    this.angle = this.effect.flowField[index];
    this.speedX = Math.cos(this.angle);
    this.speedY = Math.sin(this.angle);
    this.x += this.speedX * this.speedModifier;
    this.y += this.speedY * this.speedModifier;
    this.hue += 0.6;
  }
  edges() {
    if (this.x < 0) {
      this.x = this.effect.width;
      this.reset();
    } else if (this.x > this.effect.width) {
      this.x = 0;
      this.reset();
    }

    if (this.y < 0) {
      this.y = this.effect.height;
      this.reset();
    } else if (this.y > this.effect.height) {
      this.y = 0;
      this.reset();
    }
  }
  reset() {
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.numP = 5000;
    this.particles = [];
    this.cellSize = 20;
    this.rows;
    this.cols;
    this.flowField = [];
    this.zoom = 0.05;
    this.curve = 20;
    this.init();

    const zoomSlider = document.getElementById("zoom");
    const zoomLabel = document.getElementById("zoomLabel");
    const curveSlider = document.getElementById("curve");
    const curveLabel = document.getElementById("curveLabel");

    zoomSlider.addEventListener("change", (e) => {
      this.zoom = Number(e.target.value);
      zoomLabel.innerText = `Zoom   ${this.zoom}`;
      this.init();
    });
    curveSlider.addEventListener("change", (e) => {
      this.curve = Number(e.target.value);
      curveLabel.innerText = `Curve    ${this.curve}`;
    });

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }
  init() {
    //create flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle =
          (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
        this.flowField.push(angle);
      }
    }
    //create Particles
    for (let i = 0; i < this.numP; i++) {
      this.particles.push(new Particle(this));
    }
  }
  drawGrid(ctx) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        ctx.strokeStyle = "white";
        ctx.rect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        ctx.stroke();

        // ctx.fillText(
        //   this.flowField[x].toFixed(2),
        //   x * this.cellSize,
        //   y * this.cellSize
        // );
      }
    }
  }
  resize(width, height) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.init();
  }

  render(ctx) {
    this.particles.forEach((particle) => {
      // this.drawGrid(ctx);
      particle.draw(ctx);
      particle.edges();
      particle.update();
    });
  }
}
const effect = new Effect(canvas.width, canvas.height);

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.01)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();


