class Shooter {

	private bullets:CMover[] = new Array();

	constructor() {

	}

	public update(frame) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(frame);
		}
	}

	public shot(x, y, vx, vy) {
		var b = new Bullet(vx, vy);
		b.x = x;
		b.y = y;
		var v = GameManager.getInstance().getCurrentView();
		v.addMover(b);
		this.bullets.push(b);
	}

	public getBullets() {
		return this.bullets;
	}
}