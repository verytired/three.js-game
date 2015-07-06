/// <reference path="Mover.ts"/>

class Shooter {

	private bullets:Mover[] = new Array();

	constructor() {}

	public update(frame) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(frame);
		}
	}

	public shot(x, y, vx, vy) {
		var b = new BulletEnemy(vx, vy);
		var v = GameApp.getInstance().getCurrentView();
		var z = GameManager.getInstance().zPosition;
		b.setPosition(x, y, z)
		v.addMover(b);
		this.bullets.push(b);
	}

	public getBullets() {
		return this.bullets;
	}
}