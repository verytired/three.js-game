//敵クラス
/// <reference path="GameManager.ts"/>


class EnemyCharacter extends CMover {

	public id = 0;

	public x = 0;
	public y = 0;
	z = 0;

	public vx = 0;
	public vy = 0;

	private stageWidth = 0;
	private stageHeight = 0;

	public point = 150;

	private startFrame = 0;
	private currentFrame = 0;

	private bullets:CMover[] = new Array();

	constructor(startframe) {
		super()

		this.startFrame = startframe
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

	public update(nowFrame) {
		this.currentFrame = nowFrame - this.startFrame;
		this.frameTest();
		this.x += this.vx;
		this.y += this.vy
		this.checkAreaTest()
		this._obj.position.set(this.x, this.y, 50);

		for (var i = 0; this.bullets.length < i; i++) {
			this.bullets[i].update(nowFrame);
		}
	}

	public checkAreaTest() {
		if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
			this.isDead = true;
		}
	}

	private isShoted = false;

	public frameTest() {
		if (this.currentFrame >= 50 && this.currentFrame < 70) {
			this.vy = 0
		} else if (this.currentFrame >= 70 && this.currentFrame < 100) {
			//フレームが進まない場合の行動制限
			if (this.isShoted == true)return
			this.isShoted = true;
			this.shot()
		} else if (this.currentFrame >= 100) {
			this.vy = 6
		}
	}

	public shot() {
		var s = GameManager.getInstance().getSelfCharacter();
		var dist = Math.sqrt(Math.pow((s.x - this.x), 2) + Math.pow((s.y - this.y), 2));
		var b = new Bullet((s.x - this.x) / dist * 3, (s.y - this.y) / dist * 3);
		b.x = this.x
		b.y = this.y
		var v = GameManager.getInstance().getCurrentView();
		v.addMover(b);
		this.bullets.push(b);
	}

	public getBullets() {
		return this.bullets;
	}
}
