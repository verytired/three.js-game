/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="View.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="EnemyCharacter.ts"/>


class TestGameView extends View {

	private enemies:EnemyCharacter[] = new Array();
	private bullets:Character[] = new Array();
	private explosions:Explosion[] = new Array();

	private self:Character;

	private gm:GameManager;

	private waitingRestart = false;
	private timerId = 0 ;

	private bg:Stage;

	private sceneData
	constructor(data) {
		super()
		this.sceneData = data;
		console.log("view init")
		console.log(this.sceneData)
	}



	public init() {

		this.gm = GameManager.getInstance();

		//create background
		this.bg = new Stage();
		this.bg.init();
		this.addCharacter(this.bg);

		//set control manager
		var cm = ControlManager.getInstance();
		cm.addEventListener("onKeyPress", (e)=> {
			if(this.isKeyLock == true){
				return
			}
			switch (e.data.keyCode) {
				case 32:

					if(this.waitingRestart == true){
						this.restart();
						return
					}
					//todo ショットを打つ
					var b = new Bullet();
					b.x = this.self.x
					b.y = this.self.y
					this.addCharacter(b);
					this.bullets.push(b);
					break
				case 65:
					console.log("left");
					this.self.x -= 10;
					break
				case 87:
					console.log("up");
					this.self.y += 10;
					break
				case 68:
					console.log("right");
					this.self.x += 10;
					break
				case 83:
					console.log("down");
					this.self.y -= 10;
					break
			}
		})

		this.startGame();
	}

	public update() {

		this.hitTest()
		this.checkLiveTest()
		super.update();

		//todo 爆風更新が別になっているのをなんとかしたい
		for (var i = 0; i < this.explosions.length; i++) {
			this.explosions[i].update();
		}
	}

	/**
	 * 当たり判定
	 */
	public hitTest() {

		//弾と敵の当たり判定
		for (var i = 0; i < this.bullets.length; i++) {
			for (var j = 0; j < this.enemies.length; j++) {
				if (this.bullets[i].x > this.enemies[j].x - 15 && this.bullets[i].x < this.enemies[j].x + 15 && this.bullets[i].y > this.enemies[j].y - 15 && this.bullets[i].y < this.enemies[j].y + 15) {
					this.bullets[i].isDead = true;
					this.enemies[j].isDead = true;
					this.gm.addScore(this.enemies[j].point)
					var ex = new Explosion(this.enemies[j].x, this.enemies[j].y);
					this.add(ex.getParticles());
					this.explosions.push(ex)
				}
			}
		}

		//敵と自分の当たり判定
		for (var j = 0; j < this.enemies.length; j++) {
			if (this.self.x > this.enemies[j].x - 15 && this.self.x < this.enemies[j].x + 15 && this.self.y > this.enemies[j].y - 15 && this.self.y < this.enemies[j].y + 15) {
				if (!this.self.isDead) {
					this.self.isDead = true;
					var ex = new Explosion(this.self.x, this.self.y);
					this.add(ex.getParticles());
					this.explosions.push(ex)
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
			//GameManager.getInstance().isStop = true;
			//todo 3秒後くらいにゲームオーバー表示させる→スペース押したらreplay
			this.waitingRestart = true;
			this.isKeyLock = true;
			setTimeout(()=> {
				//this.restart();
				//gameover表示
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
			if (this.enemies[n].isDead == true) {
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
		this.bg = new Stage();
		this.bg.init();
		this.addCharacter(this.bg);

		this.self = new MyCharacter()
		this.self.y = -150;
		this.addCharacter(this.self);

		this.gm.setStartTime();

		var func = ()=> {
			this.timerId = setTimeout(()=> {
				var e = new EnemyCharacter();
				e.y = 320;
				e.x = -320 + Math.random() * 640;
				this.addCharacter(e);
				this.enemies.push(e);
				func();
			}, 500)
		}
		func();
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

	}
}