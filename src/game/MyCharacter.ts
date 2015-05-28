/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../framework/CMover.ts"/>

class MyCharacter extends CMover {

	public x = 0;
	public y = 0;
	z = 0;
	public vx = 0;
	public vy = 0;

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
	}

	public update(nowFrame) {

		this._obj.position.set(this.x, this.y, 50);

		if (this.explosionObj != null) {
			this.explosionObj.update(nowFrame);
			if(this.explosionObj.isFinished == true){
				var v = GameManager.getInstance().getCurrentView();
				v.remove(this.explosionObj);
				this.waitRemove = true;
			}
		}
	}

	public explode() {
		var v = GameManager.getInstance().getCurrentView();
		v.remove(this._obj)
		var ex = new Explosion(this.x, this.y);
		v.add(ex.getParticles());
		this.explosionObj = ex;
	}
}


