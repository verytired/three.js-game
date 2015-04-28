//敵クラス


class EnemyCharacter extends Character {

	public x = 0;
	public y = 0;
	z = 0;

	public vx = 0;
	public vy = 0;

	constructor() {
		super()
		this.vy = -2

		var material = new THREE.MeshLambertMaterial( { color: 0x008866, wireframe:false } );
		this._obj = new THREE.Mesh( new THREE.TetrahedronGeometry( 20 ), material );
		this._obj.castShadow = true;
	}

	public update() {
		this.x += this.vx;
		this.y += this.vy
		this._obj.position.set(this.x, this.y, 50);
	}
}
