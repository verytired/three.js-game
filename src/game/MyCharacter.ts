/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="Character.ts"/>

class MyCharacter implements Character {

	 x = 0;
	 y = 0;
	 z = 0;

	 vx = 0;
	 vy = 0;

	private _obj:THREE.Mesh;

	constructor() {
		this.vy = -2
		var geometry = new THREE.CubeGeometry(40, 40, 40);
		var material = new THREE.MeshPhongMaterial({color: 0xff0000});
		this._obj = new THREE.Mesh(geometry, material);
		this._obj.position.set(0, 60, 50);
		this._obj.castShadow = true;
	}

	public getObject(){
		return this._obj;
	}

	public update(){
		this.y +=this.vy;
		this._obj.position.set(this.x, this.y, 50);
	}
}


