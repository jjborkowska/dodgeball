import { Ball } from "./ball.js";

export class Player extends Ball {
    public move(canvas: HTMLCanvasElement, timeSinceLastFrame: number, keys: Record<string, boolean>) {
        if (keys["a"]) {
            this.positionX = Math.max(this.radius, this.positionX - (this.speed * timeSinceLastFrame));
        }

        if (keys["d"]) {
            this.positionX = Math.min(canvas.width - this.radius, this.positionX + (this.speed * timeSinceLastFrame));
        }
    }
}