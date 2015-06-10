//弾クラス
/// <reference path="Mover.ts"/>

class Bullet extends Mover {

	private stageWidth = 0;//ステージ幅
	private stageHeight = 0;//ステージ幅

	constructor(vx, vy) {
		super();

		var s = GameApp.getInstance().getStageSize();
		this.stageWidth = s.width;
		this.stageHeight = s.height;

		this.vx = vx;
		this.vy = vy;

		//this._obj.add(new THREE.Mesh(
		//	//球のジオメトリ　（半径：２００）
		//	new THREE.SphereGeometry(5),
		//	//マテリアル （材質）
		//	new THREE.MeshBasicMaterial({
		//		//色（１６進数）
		//		color: 0xffffff,
		//		wireframe: true
		//	})));

		var texture = new THREE.Texture(this.generateSprite())
		texture.needsUpdate = true;
		//Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.
		texture.minFilter = THREE.LinearFilter;

		var material = new THREE.SpriteMaterial({
				map: texture,
				blending: THREE.AdditiveBlending
			}
		)
		var sp = new THREE.Sprite(material)
		sp.scale.x = sp.scale.y = 64;
		this._obj.add(sp)
		this._obj.castShadow = true;

		this.hitArea.push(new HitArea(10, 10, this.x, this.y))
		this.hitAreaPos.push(new THREE.Vector2(0, 0));
	}

	public update() {
		this.x += this.vx;
		this.y += this.vy;

		this.setPosition(this.x, this.y, this.z);
		this.checkAreaTest();
	}

	public checkAreaTest() {
		if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
			this.isDead = true;
			this.waitRemove = true;
		}
	}

	public setPosition(x, y, z) {
		for (var i = 0; i < this.hitArea.length; i++) {
			this.hitArea[i].update(x + this.hitAreaPos[i].x, y + this.hitAreaPos[i].y);
		}
		super.setPosition(x, y, z);
	}

	public generateSprite() {
		var canvas = document.createElement("canvas");
		canvas.width = 100;
		canvas.height = 100;
		var context = canvas.getContext("2d");
		var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2,
			canvas.width / 2);
		gradient.addColorStop(0, "rgba(255,255,255,1)");
		gradient.addColorStop(0.2, "rgba(0,255,255,1)");
		gradient.addColorStop(0.4, "rgba(0,0,64,1)");
		gradient.addColorStop(1, "rgba(0,0,0,1)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);
		return canvas
	}

}
