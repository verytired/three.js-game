//弾クラス
/// <reference path="Mover.ts"/>

class BulletEnemy extends Bullet {

    constructor(vx, vy) {
        super(vx, vy);
    }

    public generateSprite() {
        var canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        var context = canvas.getContext("2d");
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2,
            canvas.width / 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(255,0,255,1)");
        gradient.addColorStop(0.4, "rgba(64,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas
    }

}
