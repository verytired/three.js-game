/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="EventDispatcher.ts"/>

class Character extends events.EventDispatcher implements ICharacter {

	x = 0;
	y = 0;
	z = 0;

	vx = 0;
	vy = 0;

	public _obj:THREE.Mesh;

	constructor() {
		super()
	}

	public update(){
	}

	public getObject(){
		return this._obj;
	}
}
