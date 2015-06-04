//<reference path="ShooterNway.ts"/>

class EnemyMid extends Enemy {

	constructor(startframe) {
		super(startframe);
	}

	public initialize() {
		this.vy = -4;

		//var material = new THREE.MeshBasicMaterial({
		//	color: 0x00ff00,
		//	wireframe: true
		//});
		//this._obj.add(new THREE.Mesh(new THREE.IcosahedronGeometry(40, 1), material));

		this.baseColor = 0x00ff00;
		var materials = [
			new THREE.MeshLambertMaterial({
				color: this.baseColor,
			}),
			new THREE.MeshBasicMaterial({
				color: 0x000000,
				wireframe: true,
				transparent: true
			})
		];
		this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.IcosahedronGeometry(40, 1), materials);

		this._obj.castShadow = true;
		//this.setShooter(new ShooterNway());
		this.shooter = new ShooterNway();
		this.setLife(30);
		this.setLifeTime(540);
		this.setBaseColor(0x00FF00);

		this.hitArea.push(new HitArea(40, 40, this.x, this.y))
		this.hitAreaPos.push(new THREE.Vector2(0, 0));
	}

	public shot() {
		if (this.isDead == true)return
		this.shooter.shot(this.x, this.y, 8, 15, 3); //4way 弾丸角度間隔
	}

	public doAction() {
		if (this.currentFrame == 70) {
			this.vy = 0

		} else if (this.currentFrame == 120) {
			this.shot()
		} else if (this.currentFrame == 140) {
			this.shot()
		} else if (this.currentFrame == 160) {
			this.shot()
		} else if (this.currentFrame == 180) {
			this.shot()
		}
		else if (this.currentFrame == 200) {
			this.vy = 6
		}

		if (this.currentFrame >= this.lifeTime) {
			this.isDead = true;
			this.waitRemove = true;
		}
	}
}