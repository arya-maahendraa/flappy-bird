document.addEventListener('DOMContentLoaded', () => {
	const bird = document.querySelector('.bird');
	const gameContainer = document.querySelector('.game-container');
	const ground = document.querySelector('.ground');

	let birdLeft = 220;
	let birdBottom = 250;
	let gravity = 3;
	let isGameOver = false;
	let gap = 450;

	const startGame = () => {
		birdBottom -= gravity;
		bird.style.bottom = birdBottom + 'px';
		bird.style.left = birdLeft + 'px';
	};
	let birdTimerId = setInterval(startGame, 20);

	const jump = () => {
		if (birdBottom < 495) {
			birdBottom += 50;
		} else {
			birdBottom = 495;
		}
		bird.style.bottom = birdBottom + 'px';
	};

	const control = (e) => {
		if (e.key == 'ArrowUp') {
			jump();
		}
	};
	document.addEventListener('keyup', control);

	const gameOver = () => {
		clearInterval(birdTimerId);
		isGameOver = true;
		document.removeEventListener('keyup', control);
	};

	const generateObstacle = () => {
		let randomHeight = Math.random() * 80;
		let obsBottom = randomHeight;
		let obsLeft = 500;
		const obstacle = document.createElement('div');
		const topObstacle = document.createElement('div');
		if (!isGameOver) {
			obstacle.classList.add('obstacle');
			topObstacle.classList.add('top-obstacle');
		}
		gameContainer.appendChild(obstacle);
		gameContainer.appendChild(topObstacle);
		obstacle.style.bottom = obsBottom + 'px';
		obstacle.style.left = obsLeft + 'px';
		topObstacle.style.bottom = obsBottom + gap + 'px';
		topObstacle.style.left = obsLeft + 'px';

		const moveObstacle = () => {
			obsLeft -= 2;
			obstacle.style.left = obsLeft + 'px';
			topObstacle.style.left = obsLeft + 'px';

			if (obsLeft <= -60) {
				clearInterval(obsTimerId);
				gameContainer.removeChild(obstacle);
			}

			if (
				birdBottom <= 0 ||
				(obsLeft > 160 &&
					obsLeft < 280 &&
					birdLeft === 220 &&
					(birdBottom < obsBottom + 153 ||
						birdBottom > obsBottom + gap - 200))
			) {
				clearInterval(obsTimerId);
				clearTimeout(obsTimeOutId);
				gameOver();
			}
		};
		let obsTimerId = setInterval(moveObstacle, 20);
		let obsTimeOutId = setTimeout(generateObstacle, 2500);
	};
	generateObstacle();
});
