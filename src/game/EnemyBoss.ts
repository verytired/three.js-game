class EnemyBoss extends Enemy {

	constructor(startframe) {
		super(startframe);
	}

	public initialize() {
		this.vy = -4;

		var material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true
		});
		this._obj = new THREE.Mesh(new THREE.IcosahedronGeometry(40, 1), material);
		this._obj.castShadow = true;
		this.setShooter(new SingleShooter());
		this.setLife(30);
		this.setLifeTime(540);
		this.setBaseColor(0x00FF00);
	}

	public doAction() {
		if (this.currentFrame == 70) {
			this.vy = 0

		} else if (this.currentFrame == 160) {
			if (this.isShoted == true)return
			this.isShoted = true;

			this.shot()
		} else if (this.currentFrame == 200) {
			this.vy = 6
		}


	}
}