/// <reference path="../framework/GameApp.ts"/>

class NwayShooter extends Shooter {

	constructor() {
		super();
	}

	public shot(x, y, nway, durationRad, speed = 5) {
		if (nway <= 1)return
		var baseForward = 270;
		var totalRad = durationRad * (nway - 1);
		var startRad = baseForward - totalRad / 2;
		var v = GameApp.getInstance().getCurrentView();

		for (var i = 0; i < nway; i++) {
			var vx = Math.cos((startRad + durationRad * i) * (Math.PI / 180)) * speed;
			var vy = Math.sin((startRad + durationRad * i) * (Math.PI / 180)) * speed;
			var b = new Bullet(vx, vy);
			b.x = x;
			b.y = y;
			v.addMover(b);
			this.getBullets().push(b);
		}
	}

}