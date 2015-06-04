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

		this._obj.add(new THREE.Mesh(
			//球のジオメトリ　（半径：２００）
			new THREE.SphereGeometry(5),
			//マテリアル （材質）
			new THREE.MeshBasicMaterial({
				//色（１６進数）
				color: 0xffffff,
				wireframe: true
			})));

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
}
