class Shooter {

	private bullets:CMover[] = new Array();

	constructor() {

	}

	public update(frame) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(frame);
		}
	}

	public shot() {

	}

	public getBullets() {
		return this.bullets;
	}
}