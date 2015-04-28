/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="View.ts"/>
/// <reference path="EnemyCharacter.ts"/>

class TestGameView extends View {

	constructor() {
		super()
	}

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

		var c = new MyCharacter()
		c.y = -150;
		this.addCharacter(c);
		var cm = ControlManager.getInstance();
		cm.addEventListener("onKeyPress", (e)=> {
			switch (e.data.keyCode) {
				case 32:
					//todo ショットを打つ
					var b = new Bullet();
					b.x = c.x
					b.y = c.y
					this.addCharacter(b);
					break
				case 65:
					console.log("left");
					c.x -= 10;
					break
				case 87:
					console.log("up");
					c.y += 10;
					break
				case 68:
					console.log("right");
					c.x += 10;
					break
				case 83:
					console.log("down");
					c.y -= 10;
					break
			}
		})

		var that = this;
		var func = ()=> {
			setTimeout(()=> {
				console.log("test")
				var e = new EnemyCharacter();
				e.y = 320;
				e.x = -320 + Math.random() * 640;
				that.addCharacter(e);
				func();
			}, 1000)
		}

		func();
	}
}