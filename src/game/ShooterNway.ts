/// <reference path="../framework/GameApp.ts"/>

class ShooterNway extends Shooter {

    constructor() {
        super();
    }

    public shot(x, y, nway, durationRad, speed = 5) {
        if (nway <= 1) {return;}
        var baseForward = 270;
        var totalRad = durationRad * (nway - 1);
        var startRad = baseForward - totalRad / 2;
        var v = GameApp.getInstance().getCurrentView();

        var z = GameManager.getInstance().zPosition;
        for (var i = 0; i < nway; i++) {
            var vx = Math.cos((startRad + durationRad * i) * (Math.PI / 180)) * speed;
            var vy = Math.sin((startRad + durationRad * i) * (Math.PI / 180)) * speed;
            var b = new BulletEnemy(vx, vy);
            b.setPosition(x, y, z);
            v.addMover(b);
            this.getBullets().push(b);
        }
    }

}
