class EnemyBoss extends Enemy {

	private moveType = 0;

	constructor(startframe) {
		super(startframe);
	}

	public initialize() {
		this.vy = -2;

		var material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true
		});
		this._obj = new THREE.Mesh(new THREE.IcosahedronGeometry(120, 3), material);
		this._obj.castShadow = true;
		this.setShooter(new SingleShooter());
		this.setLife(1000);
		this.setLifeTime(-1);
		this.setBaseColor(0x00FF00);

		this.hitArea.push(new HitArea(120, 120, this.x, this.y))
		this.hitAreaPos.push(new THREE.Vector2(0, 0));
	}

	public doAction() {
		if (this.currentFrame == 70) {
			this.vy = 0

		} else if (this.currentFrame == 160) {
			if (this.isShoted == true)return
			this.isShoted = true;

			this.shot()
		} else if (this.currentFrame == 200) {
		}

	}
}