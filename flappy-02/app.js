const cvs = document.getElementById('game-canvas');
const ctx = cvs.getContext('2d');

// ======== GAME VARIABLE AND CONST
let frames = 0;
const DEGREE = Math.PI / 180;

// load sprite img
const sprite = new Image();
sprite.src = './img/sprite.png';

// game sate
const state = {
	current: 0,
	getReady: 0,
	game: 1,
	over: 2,
};

// game constrol
cvs.addEventListener('click', (e) => {
	switch (state.current) {
		case state.getReady:
			state.current = state.game;
			break;
		case state.game:
			bird.flap();
			break;
		case state.over:
			state.current = state.getReady;
			pipe.positions = [];
			break;

		default:
			break;
	}
});

// background
const bg = {
	sX: 0,
	sY: 0,
	w: 275,
	h: 226,
	x: 0,
	y: cvs.height - 226,

	draw: function () {
		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x,
			this.y,
			this.w,
			this.h
		);

		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x + this.w,
			this.y,
			this.w,
			this.h
		);
	},
};

// foreground
const fg = {
	sX: 276,
	sY: 0,
	w: 224,
	h: 112,
	x: 0,
	y: cvs.height - 112,
	dx: 2,

	draw: function () {
		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x,
			this.y,
			this.w,
			this.h
		);

		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x + this.w,
			this.y,
			this.w,
			this.h
		);
	},

	update: function () {
		if (state.current == state.game) {
			this.x = (this.x - this.dx) % (this.w / 2);
		}
	},
};

// bird
const bird = {
	animation: [
		{ sX: 276, sY: 112 },
		{ sX: 276, sY: 139 },
		{ sX: 276, sY: 139 },
		{ sX: 276, sY: 164 },
	],
	x: 50,
	y: 150,
	w: 34,
	h: 26,
	frame: 0,

	gravity: 0.25,
	jump: 4.6,
	speed: 0,
	rotation: 0,
	radius: 12,

	draw: function () {
		let bird = this.animation[this.frame];

		// make bird rotate
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(
			sprite,
			bird.sX,
			bird.sY,
			this.w,
			this.h,
			-this.w / 2,
			-this.h / 2,
			this.w,
			this.h
		);

		ctx.restore();
	},

	flap: function () {
		this.speed = -this.jump;
	},

	update: function () {
		this.period = state.current == state.getReady ? 10 : 5;
		this.frame += frames % this.period == 0 ? 1 : 0;
		this.frame = this.frame % this.animation.length;

		if (state.current == state.getReady) {
			this.y = 150;
			this.speed = 0;
			this.rotation = 0 * DEGREE;
		} else {
			this.speed += this.gravity;
			this.y += this.speed;

			// game touch fourground
			if (this.y + this.h / 2 >= cvs.height - fg.h) {
				this.y = cvs.height - fg.h - this.h / 2;
				if (state.current == state.game) {
					state.current = state.over;
				}
			}

			// rotation agle
			if (this.speed >= this.jump) {
				this.rotation = 90 * DEGREE;
				this.frame = 1;
			} else {
				this.rotation = -25 * DEGREE;
			}
		}
	},
};

// get ready message
const getready = {
	sX: 0,
	sY: 228,
	w: 173,
	h: 152,
	x: cvs.width / 2 - 173 / 2,
	y: 80,

	draw: function () {
		if (state.current == state.getReady) {
			ctx.drawImage(
				sprite,
				this.sX,
				this.sY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			);
		}
	},
};

// game over message
const gameOver = {
	sX: 175,
	sY: 228,
	w: 225,
	h: 202,
	x: cvs.width / 2 - 225 / 2,
	y: 90,

	draw: function () {
		if (state.current == state.over) {
			ctx.drawImage(
				sprite,
				this.sX,
				this.sY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			);
		}
	},
};

// pipes
const pipe = {
	positions: [],
	top: {
		sX: 553,
		sY: 0,
	},
	bottom: {
		sX: 502,
		sY: 0,
	},
	w: 53,
	h: 400,
	gap: 85,
	maxPos: -150,
	dx: 2,

	draw: function () {
		for (let i = 0; i < this.positions.length; i++) {
			const pos = this.positions[i];
			const topYPos = pos.y;
			const bottomYPos = pos.y + this.h + this.gap;

			// top pipe
			ctx.drawImage(
				sprite,
				this.top.sX,
				this.top.sY,
				this.w,
				this.h,
				pos.x,
				topYPos,
				this.w,
				this.h
			);

			// bottom pipe
			ctx.drawImage(
				sprite,
				this.bottom.sX,
				this.bottom.sY,
				this.w,
				this.h,
				pos.x,
				bottomYPos,
				this.w,
				this.h
			);
		}
	},

	update: function () {
		if (state.current !== state.game) return;
		if (frames % 100 == 0) {
			this.positions.push({
				x: cvs.width,
				y: this.maxPos * (Math.random() + 1),
			});
		}

		for (let i = 0; i < this.positions.length; i++) {
			const pos = this.positions[i];
			pos.x -= this.dx;
			const bottomYPos = pos.y + this.h + this.gap;

			// ====== collision detection
			// top pipe
			if (
				bird.x + bird.radius > pos.x &&
				bird.x - bird.radius <= pos.x + this.w &&
				bird.y + bird.radius > pos.y &&
				bird.y - bird.radius <= pos.y + this.h
			) {
				state.current = state.over;
			}

			// bottom pipe
			if (
				bird.x + bird.radius > pos.x &&
				bird.x - bird.radius <= pos.x + this.w &&
				bird.y + bird.radius > bottomYPos &&
				bird.y - bird.radius <= bottomYPos + this.h
			) {
				state.current = state.over;
			}

			//remove pipe if go beyond canvas
			if (pos.x + this.w <= 0) {
				this.positions.shift();
			}
		}
	},
};

// ======== DRAW
function draw() {
	ctx.fillStyle = '#70c5ce';
	ctx.fillRect(0, 0, cvs.clientWidth, cvs.height);

	bg.draw();
	pipe.draw();
	fg.draw();
	bird.draw();
	getready.draw();
	gameOver.draw();
}

// ======== UPDATE
function update() {
	bird.update();
	fg.update();
	pipe.update();
}

// ======== LOOP
function loop() {
	update();
	draw();
	frames++;

	requestAnimationFrame(loop);
}
loop();
