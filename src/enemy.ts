import { Ball } from "./ball.js";

export class Enemy extends Ball {
    protected speedX: number;

    protected speedY: number;

    public constructor(
        x: number, 
        y: number, 
        radius: number, 
        speed: number,
        speedX: number,
        speedY: number,
        color: string,
    ) {
        super(x, y, radius, speed, color);
        
        this.speedX = speedX;
        this.speedY = speedY;
    }

    public move(canvas: HTMLCanvasElement, timeSinceLastFrame: number) {
        // move: calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant
        this.speedY -= 0.0098 * timeSinceLastFrame;
        // Calculate new X and Y parts of the position
        // Formula: S = v*timeSinceLastFrame
        this.positionX += (this.speedX * timeSinceLastFrame) * (this.speed / 25);
        // Formula: S=v0*timeSinceLastFrame + 0.5*g*timeSinceLastFrame^2
        this.positionY += ((this.speedY * timeSinceLastFrame) * (this.speed / 100)) + 0.5 * 0.0098 * timeSinceLastFrame * timeSinceLastFrame;

        // collide: check if the ball hits the walls and let it bounce
        // Left wall
        if (this.positionX <= this.radius && this.speedX < 0) {
            this.speedX = -this.speedX;
        }

        // Right wall
        if (this.positionX >= canvas.width - this.radius
            && this.speedX > 0) {
            this.speedX = -this.speedX;
        }

        // Bottom
        if (this.positionY <= this.radius && this.speedY < 0) {
            this.speedY = -this.speedY;
        }

        // Top
        if (this.positionY >= canvas.height - this.radius && this.speedY > 0) {
            this.speedY = - this.speedY
        }
    }
}