//弾クラス

class Bullet extends Character {

	public x = 0;
	public y = 0;
	z = 0;

	public vx = 0;
	public vy = 0;

	constructor() {
		super()
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
		this._obj.position.set(this.x, this.y, 50);
	}
}
