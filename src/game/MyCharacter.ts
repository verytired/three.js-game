/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="Character.ts"/>

class MyCharacter extends Character {

	public x = 0;
	public y = 0;
	z = 0;
	public vx = 0;
	public vy = 0;

	constructor() {
		super();
		this.vy = -2;
		var geometry = new THREE.BoxGeometry(20, 20, 20);
		var material = new THREE.MeshPhongMaterial({color: 0xff0000});

		this._obj = new THREE.Mesh(geometry, material);
		this._obj.castShadow = true;
	}

	public update() {
		//this.y +=this.vy;
		this._obj.position.set(this.x, this.y, 50);
	}
}


