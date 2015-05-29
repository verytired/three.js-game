/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../framework/CView.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="EnemyCharacter.ts"/>


class GameView extends CView {

	private self:CMover;
	private enemies:EnemyCharacter[] = new Array();
	private enemyBullets:CMover[] = new Array();
	private bullets:CMover[] = new Array();
	private bg:Stage;

	private waitingRestart = false;
	private timerId = 0;

	private sceneData;

	constructor() {
		super();
	}

	public init() {
		super.init();

		//create background
		this.bg = new Stage();
		this.bg.init();
		this.addMover(this.bg);

		this.sceneData = this.gm.getSceneData(0);
		this.nextActionNum = 0;

		this.startGame();
	}

	public keyEvent(e:any) {
		if (this.isKeyLock == true) {
			return
		}
		switch (e.data.keyCode) {
			case 32:
				if (this.waitingRestart == true) {
					this.restart();
					return
				}
				//shot bullets
				var b = new Bullet(0, 6);
				b.x = this.self.x;
				b.y = this.self.y;
				this.addMover(b);
				this.bullets.push(b);
				break
			case 65:
				this.self.x -= 10;
				break
			case 87:
				this.self.y += 10;
				break
			case 68:
				this.self.x += 10;
				break
			case 83:
				this.self.y -= 10;
				break
		}
	}

	private nextActionFrame = 0;
	private nextActionNum = 0;

	public update() {
		var currentFrame = this.gm.getCurrentFrame();
		this.gm.debug(currentFrame);
		if (this.nextActionNum < this.sceneData.length && currentFrame == this.sceneData[this.nextActionNum].frame) {
			var enemies = this.sceneData[this.nextActionNum].enemies;
			for (var i = 0; i < enemies.length; i++) {
				var e = new EnemyCharacter(this.gm.getCurrentFrame());
				e.x = enemies[i].x;
				e.y = enemies[i].y;
				this.addMover(e);
				this.enemies.push(e);
			}
			this.nextActionNum++;
		}
		this.hitTest()
		this.checkLiveTest()
		super.update(this.gm.getCurrentFrame());
	}

	/**
	 * 当たり判定
	 */
	public hitTest() {

		//弾と敵の当たり判定
		for (var i = 0; i < this.bullets.length; i++) {
			for (var j = 0; j < this.enemies.length; j++) {
				if (this.bullets[i].x > this.enemies[j].x - 15 && this.bullets[i].x < this.enemies[j].x + 15 && this.bullets[i].y > this.enemies[j].y - 15 && this.bullets[i].y < this.enemies[j].y + 15) {
					if (!this.enemies[j].isDead) {
						this.bullets[i].waitRemove = true;
						this.enemies[j].isDead = true;
						this.enemies[j].explode();
						this.gm.addScore(this.enemies[j].point)
					}
				}
			}
		}

		//敵の弾と自分の当たり判定
		for (var j = 0; j < this.enemies.length; j++) {
			var bulletArray = this.enemies[j].getBullets();
			for (var k = 0; k < bulletArray.length; k++) {
				var b = bulletArray[k]
				if (this.self.x > b.x - 15 && this.self.x < b.x + 15 && this.self.y > b.y - 15 && this.self.y < b.y + 15) {
					if (!this.self.isDead) {
						this.self.isDead = true;
						this.self.explode();
					}
				}
			}
		}

		//敵と自分の当たり判定
		for (var j = 0; j < this.enemies.length; j++) {
			if (this.self.x > this.enemies[j].x - 15 && this.self.x < this.enemies[j].x + 15 && this.self.y > this.enemies[j].y - 15 && this.self.y < this.enemies[j].y + 15) {
				if (!this.self.isDead) {
					this.self.isDead = true;
					//var ex = new Explosion(this.self.x, this.self.y);
					//this.add(ex.getParticles());
					//this.explosions.push(ex)
					this.self.explode();
				}
			}
		}
	}

	/**
	 * キャラクタの表示確認
	 */

	private isKeyLock = false;

	public checkLiveTest() {
		if (this.self.isDead == true && this.waitingRestart == false) {
			//3秒後くらいにゲームオーバー表示させる→スペース押したらreplay
			this.waitingRestart = true;
			this.isKeyLock = true;
			setTimeout(()=> {
				//gameover表示
				$("#overlay").show();
				$("#view-gameover").show();
				this.isKeyLock = false;
			}, 3000)
			return
		}
		var n = 0
		for (var i = 0; i < this.bullets.length; i++) {
			if (this.bullets[n].isDead == true) {
				this.bullets.splice(n, 1)
			} else {
				n++;
			}
		}
		n = 0
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[n].waitRemove == true) {
				this.enemies.splice(n, 1)
			} else {
				n++;
			}
		}
	}

	/**
	 * ゲームオーバー処理
	 */
	public setGameOver() {
	}

	/**
	 * ゲーム開始
	 */
	public startGame() {
		$("#overlay").hide();
		this.bg = new Stage();
		this.bg.init();
		this.addMover(this.bg);

		this.self = new MyCharacter()
		this.self.y = -150;
		this.addMover(this.self);
		this.gm.setSelfCharacter(this.self);

		this.gm.setStartTime();

		//var func = ()=> {
		//	this.timerId = setTimeout(()=> {
		//		var e = new EnemyCharacter(this.gm.getCurrentFrame());
		//		e.y = 320;
		//		e.x = -320 + Math.random() * 640;
		//		this.addMover(e);
		//		this.enemies.push(e);
		//		func();
		//	}, 500)
		//}
		//func();
	}

	/**
	 * リスタート処理
	 */
	public restart() {
		this.waitingRestart = false;
		clearTimeout(this.timerId);
		this.removeAll();
		this.bullets.length = 0;
		this.enemies.length = 0;
		this.gm.setScore(0);
		this.startGame();
		this.nextActionNum = 0;
	}
}