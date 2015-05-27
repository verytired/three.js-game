//敵クラス
/// <reference path="GameManager.ts"/>


class EnemyCharacter extends Character {

	public id = 0;

	public x = 0;
	public y = 0;
	z = 0;

	public vx = 0;
	public vy = 0;

	private stageWidth = 0;
	private stageHeight = 0;

	public point = 150;

	private currentFrame = 0;

	constructor() {
		super()
		this.vy = -6

		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true
		});
		this._obj = new THREE.Mesh(new THREE.TetrahedronGeometry(20), material);
		this._obj.castShadow = true;

		var s = GameManager.getInstance().getStageSize();
		this.stageWidth = s.width;
		this.stageHeight = s.height;
	}

	public update() {
		this.currentFrame++;
		this.frameTest();
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

	public frameTest(){
		if(this.currentFrame == 50){
			this.vy = 0
		} else if(this.currentFrame == 70){
			this.shot()
		} else if(this.currentFrame == 100){
			this.vy = 6
		}

	}

	public shot(){
		console.log("enemyShot");
	}
}
