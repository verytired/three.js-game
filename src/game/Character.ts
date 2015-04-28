/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

class Character implements ICharacter {

	x = 0;
	y = 0;
	z = 0;

	vx = 0;
	vy = 0;

	public _obj:THREE.Mesh;

	constructor() {
	}

	public update(){
	}

	public getObject(){
		return this._obj;
	}
}
