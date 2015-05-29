//敵クラス
/// <reference path="GameManager.ts"/>

class Enemy extends CMover {

	public id = 0;

	private stageWidth = 0;
	private stageHeight = 0;

	private point = 150; //得点
	private life = 1;//生存時間
	private lifeTime = 500;//生存時間

	private startFrame = 0;
	private currentFrame = 0;

	private explosionObj;//爆発オブジェクト格納
	private shooter:Shooter;//弾発射オブジェクト

	constructor(startframe) {
		super();
		this.startFrame = startframe;
		var s = GameManager.getInstance().getStageSize();
		this.stageWidth = s.width;
		this.stageHeight = s.height;
		this.initialize();
	}

	public initialize() {

		this.vy = -6;

		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true
		});
		this._obj = new THREE.Mesh(new THREE.TetrahedronGeometry(20), material);
		this._obj.castShadow = true;
		this.shooter = new SingleShooter();
	}

	public update(nowFrame) {
		this.currentFrame = nowFrame - this.startFrame;
		this.doAction();
		this.x += this.vx;
		this.y += this.vy;

		this._obj.position.set(this.x, this.y, 50);

		if (this.explosionObj != null) {
			this.explosionObj.update(nowFrame);
			if (this.explosionObj.isFinished == true) {
				var v = GameManager.getInstance().getCurrentView();
				v.remove(this.explosionObj);
				this.waitRemove = true;
			}
		}
	}

	private isShoted = false;

	/**
	 * 行動処理
	 */
	public doAction() {
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
		var ex = new Explosion(this.x, this.y, 0xFFFFFFF);
		v.add(ex.getParticles());
		this.explosionObj = ex;
	}

	//hit
	public hit() {
		var ma:any = this._obj.material
		ma.color.setHex(0xFF0000);
		setTimeout(()=> {
			ma.color.setHex(0xFFFFF);
		}, 200)
		this.life--;
		if (this.life <= 0) {
			this.isDead = true;
			this.explode();
		}
	}

	public getPoint() {
		return this.point;
	}

	public setLifeTime(t) {
		this.lifeTime = t;
	}

	public setLife(l) {
		this.life = l;
	}

	public setShooter(s){
		this.shooter = s

	}
}
