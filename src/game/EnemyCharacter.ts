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

	private explosionObj;

	private lifeTime = 500;

	private shooter:Shooter;

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

		this.shooter = new SingleShooter();
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
		if (this.explosionObj != null) {
			this.explosionObj.update(nowFrame);
			if (this.explosionObj.isFinished == true) {
				var v = GameManager.getInstance().getCurrentView();
				v.remove(this.explosionObj);
				this.waitRemove = true;
			}
		}
	}

	public checkAreaTest() {
		//if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
		//	this.isDead = true;
		//}
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

		if (this.currentFrame >= this.lifeTime) {
			this.isDead = true;
			this.waitRemove = true;
		}
	}

	public shot() {
		if (this.isDead == true)return
		var s = GameManager.getInstance().getSelfCharacter();
		var dist = Math.sqrt(Math.pow((s.x - this.x), 2) + Math.pow((s.y - this.y), 2));
		this.shooter.shot(this.x, this.y, (s.x - this.x) / dist * 3, (s.y - this.y) / dist * 3);
	}

	public getBullets() {
		return this.shooter.getBullets();
	}

	public explode() {
		var v = GameManager.getInstance().getCurrentView();
		v.remove(this._obj)
		var ex = new Explosion(this.x, this.y);
		v.add(ex.getParticles());
		this.explosionObj = ex;
	}
}
