import { Enemy } from "./enemy.js";
import { Player } from "./player.js";

console.log('Javascript is working!');

/**
 * Main class of this Game.
 */
class Game {
    private canvas: HTMLCanvasElement;

    private player: Player;

    private enemies: Enemy[] = [];

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

        const enemyRadius = 10 + 10 * Math.random();

        const enemyAmount = 5;
        for(let i = 0; i < enemyAmount; i++) {
            this.enemies.push(
                new Enemy(
                    enemyRadius + (this.canvas.width - 2 * enemyRadius) * Math.random(),
                    this.canvas.height * 0.8 + this.canvas.height * 0.2 * Math.random(),
                    enemyRadius,
                    10 * Math.random(),
                    -5 + 10 * Math.random(),
                    0,
                    'blue'
                ),
            )
        }

        this.player = new Player(this.canvas.width / 2, 50, 50, 0.5, 'red');

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

        this.player.move(this.canvas, timeSinceLastFrame, this.keys);
        this.enemies.forEach((enemy) => {
            enemy.move(this.canvas, timeSinceLastFrame);
        })

        // draw: the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.canvas);
        this.enemies.forEach((enemy) => {
            enemy.draw(this.canvas);
        })

        // Call this method again on the next animation frame

        const gameover = this.enemies.some((enemy) => {
            return this.player.isHittingOtherBall(enemy)
        });

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
