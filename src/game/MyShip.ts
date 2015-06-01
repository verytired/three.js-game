/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../framework/CMover.ts"/>

class MyShip extends CMover {

	private explosionObj = null;

	constructor() {
		super();
		this.vy = -2;
		var geometry = new THREE.BoxGeometry(20, 20, 20);
		var material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true
		});

		this._obj = new THREE.Mesh(geometry, material);
		this._obj.castShadow = true;

		//var ma:any = this._obj.material
		//ma.color.setHex(0x0000FF);

		console.log(this._obj.material)
	}

	public update(nowFrame) {

		this.setPosition(this.x, this.y, this.z);

		if (this.explosionObj != null) {
			this.explosionObj.update(nowFrame);
			if (this.explosionObj.isFinished == true) {
				var v = GameApp.getInstance().getCurrentView();
				v.remove(this.explosionObj);
				this.waitRemove = true;
			}
		}
	}

	public explode() {
		var v = GameApp.getInstance().getCurrentView();
		v.remove(this._obj)
		var ex = new Explosion(this.x, this.y, 0xFF0000);
		v.add(ex.getParticles());
		this.explosionObj = ex;
	}

}


