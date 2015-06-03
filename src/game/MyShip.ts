/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="Mover.ts"/>

class MyShip extends Mover {

	constructor() {
		super();
		this.vy = -2;
		var geometry = new THREE.BoxGeometry(20, 20, 20);
		var material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true
		});

		this._obj.add(new THREE.Mesh(geometry, material));
		this._obj.castShadow = true;

		this.hitArea.push(new HitArea(20, 20, this.x, this.y))
		this.hitAreaPos.push(new THREE.Vector2(0, 0));
	}

	public update(nowFrame) {
		this.setPosition(this.x, this.y, this.z);
		for (var i = 0; i < this.hitArea.length; i++) {
			this.hitArea[i].update(this.x + this.hitAreaPos[i].x, this.y + this.hitAreaPos[i].y);
		}
	}

	public explode() {
		this.waitRemove = true;

		var v = GameApp.getInstance().getCurrentView();
		//v.remove(this._obj)
		var ex = new Explosion(this.x, this.y, 0xFF0000);
		v.addMover(ex);
	}

}


