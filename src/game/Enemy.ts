//敵クラス
/// <reference path="Mover.ts"/>
/// <reference path="SingleShooter.ts"/>

class Enemy extends Mover {

	private point = 150; //得点
	public life = 1;//生存時間
	public lifeTime = 500;//生存時間
	private startFrame = 0;//開始フレーム
	public currentFrame = 0;//現在のフレーム
	public shooter;//弾発射オブジェクト
	public baseColor = 0xFFFFFF;//カラー
	public receiveDamage = true;//ダメージ受付フラグ

	constructor(startframe) {
		super();
		this.startFrame = startframe;
		this.initialize();
	}

	public initialize() {
		this.vy = -6;
		//var material = new THREE.MeshBasicMaterial({
		//	color: this.baseColor,
		//	wireframe: true
		//});
		//this._obj.add(new THREE.Mesh(new THREE.OctahedronGeometry(20, 1), material))
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
		this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.OctahedronGeometry(20, 1), materials);

		this._obj.castShadow = true;
		this.shooter = new SingleShooter();

		this.hitArea.push(new HitArea(20, 20, this.x, this.y))
		this.hitAreaPos.push(new THREE.Vector2(0, 0));
	}

	public update(nowFrame) {
		var frame = nowFrame - this.startFrame;
		if (frame <= this.currentFrame)return
		this.currentFrame = frame;
		this.doAction();

		this.x += this.vx;
		this.y += this.vy;

		this.setPosition(this.x, this.y, this.z);
	}

	/**
	 * 行動処理
	 */
	public doAction() {
		if (this.currentFrame == 50) {
			this.vy = 0
		} else if (this.currentFrame == 70) {
			this.shot()
		} else if (this.currentFrame == 100) {
			this.vy = 6
		}
		if (this.lifeTime == -1)return;
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
		this.waitRemove = true;
		var v = GameApp.getInstance().getCurrentView();
		//v.remove(this._obj)
		var ex = new Explosion(this.x, this.y, this.baseColor);
		v.addMover(ex);
	}

	//hit
	public hit() {
		if (this.receiveDamage == false) return
		var msh:any = this._obj.children[0];
		var ma = msh.material;
		ma.color.setHex(0xFF0000);
		setTimeout(()=> {
			ma.color.setHex(this.baseColor);
		}, 200)
		this.life--;
		if (this.life <= 0) {
			this.isDead = true;
			this.explode();
		}
	}

	public setPosition(x, y, z) {
		for (var i = 0; i < this.hitArea.length; i++) {
			this.hitArea[i].update(x + this.hitAreaPos[i].x, y + this.hitAreaPos[i].y);
		}
		super.setPosition(x, y, z);
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

	public setShooter(s) {
		this.shooter = s;
	}

	public setBaseColor(c) {
		this.baseColor = c
	}
}
