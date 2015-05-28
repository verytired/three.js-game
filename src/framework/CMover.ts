/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="CEventDispatcher.ts"/>

class CMover extends events.EventDispatcher implements IMover {

	x = 0;
	y = 0;
	z = 0;

	vx = 0;
	vy = 0;

	public _obj:THREE.Mesh;
	public isDead:boolean = false;

	constructor() {
		super()
	}

	public update(nowFrame){
	}

	public getObject(){
		return this._obj;
	}

	public remove(){

	}

	public setPosition(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;

	}

}
