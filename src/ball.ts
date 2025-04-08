export abstract class Ball {
    protected positionX: number;
    
    protected positionY: number;
    
    protected radius: number;

    protected speed: number;

    protected color: string;

    public constructor(
        x: number,
        y: number,
        radius: number,
        speed: number,
        color: string = 'red',
    ) {
        this.positionX = x;
        this.positionY = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
    }

    public isHittingOtherBall(otherBall: Ball): boolean {
        const distX = this.positionX - otherBall.positionX;
        const distY = this.positionY - otherBall.positionY;

        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Collides is distance <= sum of radii of both circles
        return distance <= (this.radius + otherBall.radius);
    }

    public draw(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.beginPath();
        const positionY = canvas.height - this.positionY;
        ctx.ellipse(this.positionX, positionY, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}