/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../framework/CView.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="Enemy.ts"/>

class GameView extends CView {

	//Game Objects
	private self:CMover;
	private enemies:Enemy[] = new Array();
	private enemyBullets:CMover[] = new Array();
	private bullets:CMover[] = new Array();
	private bg:Stage;

	private isKeyLock = false;

	private waitingRestart = false;
	private timerId = 0;

	private sceneData;
	private nextActionFrame = 0;
	private nextActionNum = 0;

	private gm:GameManager;

	private zPosition = 50;

	constructor() {
		super();
	}

	public init() {
		super.init();

		//create background
		this.bg = new Stage();
		this.bg.init();
		this.addMover(this.bg);

		this.nextActionNum = 0;

		this.gm = GameManager.getInstance();
		this.sceneData = this.gm.getSceneData(0);

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
				var b = new Bullet(0, 12);
				b.setPosition(this.self.x, this.self.y, this.zPosition);
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

	public onMouseDown(e:any) {
		//console.log("onMouseStart");
	}

	public onMouseMove(e:any) {

		var nowX = e.data.x
		var nowY = e.data.y

		if (this.app.ua != "pc") {
			nowX = e.data.touches[0].clientX;
			nowY = e.data.touches[0].clientY;
		}

		var w = window.innerWidth;
		var h = window.innerHeight;

		this.self.setPosition(-240 + 480 * nowX / w, 320 - 640 * nowY / h, this.zPosition)
	}

	public onMouseUp(e:any) {
		if (this.isKeyLock == true) {
			return
		}
		if (this.waitingRestart == true) {
			this.restart();
			return
		}
	}

	public update() {
		var currentFrame = this.app.getCurrentFrame();
		this.gm.debug(currentFrame);
		if (this.nextActionNum < this.sceneData.length && currentFrame == this.sceneData[this.nextActionNum].frame) {
			var enemies = this.sceneData[this.nextActionNum].enemies;
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].type == 1) {
					var e = new Enemy(this.app.getCurrentFrame());
				} else if (enemies[i].type == 2) {
					var e = new EnemyMid(this.app.getCurrentFrame());
				} else if (enemies[i].type == 3) {
					var e = new EnemyBoss(this.app.getCurrentFrame());
				}
				//e.x = enemies[i].x;
				//e.y = enemies[i].y;
				e.setPosition(enemies[i].x, enemies[i].y, this.zPosition)
				this.addMover(e);
				this.enemies.push(e);
			}
			this.nextActionNum++;
		}
		this.hitTest()
		this.checkLiveTest()
		super.update(this.app.getCurrentFrame());
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
						this.bullets[i].isDead = true;
						this.bullets[i].waitRemove = true;
						this.enemies[j].hit();
						this.gm.addScore(this.enemies[j].getPoint())
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
	public checkLiveTest() {
		if (this.self.isDead == true && this.waitingRestart == false) {
			//3秒後くらいにゲームオーバー表示させる→スペース押したらreplay
			this.waitingRestart = true;
			this.isKeyLock = true;
			setTimeout(()=> {
				this.setGameOver();
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
		//gameover表示
		$("#overlay").show();
		$("#view-gameover").show();
		this.isKeyLock = false;
	}

	/**
	 * ゲーム開始
	 */
	public startGame() {
		$("#overlay").hide();
		this.bg = new Stage();
		this.bg.init();
		this.addMover(this.bg);

		this.self = new MyShip();
		this.self.y = -150;
		this.addMover(this.self);
		this.gm.setSelfCharacter(this.self);
		this.app.setStartTime();

		//dummy enemy generate
		//var func = ()=> {
		//	this.timerId = setTimeout(()=> {
		//		var e = new Enemy(this.app.getCurrentFrame());
		//		e.setPosition(-320 + Math.random() * 640, 320, this.zPosition);
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

	public resize() {
		this.gm.resize();
	}
}