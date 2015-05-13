/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="View.ts"/>
/// <reference path="EnemyCharacter.ts"/>

class TestGameView extends View {

	constructor() {
		super()
	}

	private enemies:Character[] = new Array();
	private bullets:Character[] = new Array();
	private explosions:Character[] = new Array();

	private self:Character;
	public init() {

		var pGeometry = new THREE.PlaneBufferGeometry(480, 640);
		var pMaterial = new THREE.MeshLambertMaterial({
			color: 0x999999,
			side: THREE.DoubleSide
		});

		var plane = new THREE.Mesh(pGeometry, pMaterial);
		plane.position.set(0, 0, 0);
		//plane.rotation.x = 90 * Math.PI / 180;
		plane.receiveShadow = true;
		this.add(plane);

		this.self = new MyCharacter()
		this.self.y = -150;
		this.addCharacter(this.self);
		var cm = ControlManager.getInstance();

		var that = this;
		cm.addEventListener("onKeyPress", (e)=> {
			switch (e.data.keyCode) {
				case 32:
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

		var that = this;
		var func = ()=> {
			setTimeout(()=> {
				var e = new EnemyCharacter();
				e.y = 320;
				e.x = -320 + Math.random() * 640;
				that.addCharacter(e);
				that.enemies.push(e);
				func();
			}, 500)
		}

		func();
	}

	public update() {
		this.hitTest()
		this.checkLiveTest()
		super.update();
		//todo 爆風更新が別になっているのをなんとかしたい
		for(var i=0;i<this.explosions.length;i++){
			this.explosions[i].update();
		}
	}

	public hitTest(){

		for (var i = 0; i < this.bullets.length; i++) {
			for (var j = 0; j < this.enemies.length; j++) {
				if(this.bullets[i].x > this.enemies[j].x-15 && this.bullets[i].x < this.enemies[j].x+15 && this.bullets[i].y > this.enemies[j].y-15 && this.bullets[i].y < this.enemies[j].y+15){
					this.bullets[i].isDead = true;
					this.enemies[j].isDead = true;
					var ex = new Explosion(this.enemies[j].x,this.enemies[j].y);
					this.add(ex.getObject());
					this.explosions.push(ex)
				}
			}
		}

		for (var j = 0; j < this.enemies.length; j++) {
			if(this.self.x > this.enemies[j].x-15 && this.self.x < this.enemies[j].x+15 && this.self.y > this.enemies[j].y-15 && this.self.y < this.enemies[j].y+15){
				this.self.isDead = true;

			}
		}
	}
	public checkLiveTest() {
		if(this.self.isDead){
			//todo stop & allclear
			GameManager.getInstance().isStop = true;
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
}