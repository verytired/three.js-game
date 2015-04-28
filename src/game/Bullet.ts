//弾クラス

class Bullet extends Character {

	public x = 0;
	public y = 0;
	z = 0;

	public vx = 0;
	public vy = 0;

	private stageWidth = 0;
	private stageHeight = 0;

	constructor() {
		super()

		var s = GameManager.getInstance().getStageSize();
		this.stageWidth = s.width;
		this.stageHeight = s.height;

		this.vy = 2
		this._obj = new THREE.Mesh(
			//球のジオメトリ　（半径：２００）
			new THREE.SphereGeometry(5),
			//マテリアル （材質）
			new THREE.MeshPhongMaterial({
				//色（１６進数）
				color: 0xffffff
			}));
		this._obj.position.set(0, 60, 50);
		this._obj.castShadow = true;
	}

	public update() {
		this.x += this.vx;
		this.y += this.vy
		this.checkAreaTest()
		this._obj.position.set(this.x, this.y, 50);
	}

	public checkAreaTest() {
		if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
			this.isDead = true;
		}
	}
}
