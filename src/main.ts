console.log('Javascript is working!');

/**
 * Main class of this Game.
 */
class Game {
    private canvas: HTMLCanvasElement;

    private ballRadius: number;

    private ballPositionX: number;

    private ballPositionY: number;

    private ballSpeed: number;

    private ballSpeedX: number;

    private ballSpeedY: number;

    private playerPositionX: number;

    private playerPositionY: number;

    private playerRadius: number;

    private playerSpeed: number;

    private lastTickTimeStamp: number;

    private keys: Record<string, boolean> = {};

    /**
     * Construc a new instance of this class
     *
     * @param canvas the canvas to render on
     */
    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;

        // Resize the canvas to full window size
        this.canvas.width = window.innerWidth - 1;
        this.canvas.height = window.innerHeight - 4;

        // Spawn a Ball
        this.ballRadius = 10 + 10 * Math.random();
        this.ballSpeedX = -5 + 10 * Math.random();
        this.ballSpeedY = 0;
        this.ballSpeed = 10;
        this.ballPositionX = this.ballRadius
            + (this.canvas.width - 2 * this.ballRadius) * Math.random();
        this.ballPositionY = this.canvas.height * 0.8 + this.canvas.height * 0.2 * Math.random();

        // Set the player at the center
        this.playerPositionX = this.canvas.width / 2;
        this.playerPositionY = 50;
        this.playerRadius = 50;
        this.playerSpeed = 0.5;

        // Listen for keyboard input
        window.addEventListener("keydown", (event) => this.keys[event.key.toLowerCase()] = true);
        window.addEventListener("keyup", (event) => this.keys[event.key.toLowerCase()] = false);
    }

    /**
     * Start the game.
     */
    public start(): void {
        // Start the animation
        console.log('start animation');
        // Set the last tick timestamp to current time
        this.lastTickTimeStamp = performance.now();
        requestAnimationFrame(this.step);
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable working
     * correctly. It will otherwise be overwritten by another object caused by
     * javascript scoping behaviour.
     *
     * @param timestamp a `DOMHighResTimeStamp` similar to the one returned by
     *   `performance.now()`, indicating the point in time when `requestAnimationFrame()`
     *   starts to execute callback functions
     */
    private step = (timestamp: number): void => {
        // To make it as accurate as possible, incorporate the time timeSinceLastFrame
        // At 60fps, each interval is approximately 17ms.
        const timeSinceLastFrame = timestamp - this.lastTickTimeStamp;
        this.lastTickTimeStamp = timestamp;

        // move: calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant
        this.ballSpeedY -= 0.0098 * timeSinceLastFrame;
        // Calculate new X and Y parts of the position
        // Formula: S = v*timeSinceLastFrame
        this.ballPositionX += (this.ballSpeedX * timeSinceLastFrame) * (this.ballSpeed / 25);
        // Formula: S=v0*timeSinceLastFrame + 0.5*g*timeSinceLastFrame^2
        this.ballPositionY += ((this.ballSpeedY * timeSinceLastFrame) * (this.ballSpeed / 100)) + 0.5 * 0.0098 * timeSinceLastFrame * timeSinceLastFrame;

        if (this.keys["a"]) {
            this.playerPositionX = Math.max(this.playerRadius, this.playerPositionX - (this.playerSpeed * timeSinceLastFrame));
        }

        if (this.keys["d"]) {
            this.playerPositionX = Math.min(this.canvas.width - this.playerRadius, this.playerPositionX + (this.playerSpeed * timeSinceLastFrame));
        }

        // collide: check if the ball hits the walls and let it bounce
        // Left wall
        if (this.ballPositionX <= this.ballRadius && this.ballSpeedX < 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Right wall
        if (this.ballPositionX >= this.canvas.width - this.ballRadius
            && this.ballSpeedX > 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Bottom only (ball will always come down)
        if (this.ballPositionY <= this.ballRadius && this.ballSpeedY < 0) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        if (this.ballPositionY >= this.canvas.height - this.ballRadius && this.ballSpeedY > 0) {
            this.ballSpeedY = - this.ballSpeedY
        }

        // adjust: Check if the ball collides with the player. It's game over
        // then
        const distX = this.playerPositionX - this.ballPositionX;
        const distY = this.playerPositionY - this.ballPositionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        const gameover = distance <= (this.ballRadius + this.playerRadius);

        // draw: the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the player
        ctx.fillStyle = 'red';
        ctx.beginPath();
        const playerPositionY = this.canvas.height - this.playerPositionY;
        ctx.ellipse(this.playerPositionX, playerPositionY, this.playerRadius, this.playerRadius, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw the ball
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        // reverse height, so the ball falls down
        const y = this.canvas.height - this.ballPositionY;
        ctx.ellipse(this.ballPositionX, y, this.ballRadius, this.ballRadius, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Call this method again on the next animation frame
        if (!gameover) {
            requestAnimationFrame(this.step);
        }
    };
}

// Add EventListener to load the game whenever the browser is ready
window.addEventListener('load', () => {
    console.log('Handling the Load event');

    const game = new Game(document.getElementById('canvas'));
    game.start();
});
