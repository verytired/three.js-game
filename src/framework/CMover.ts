/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="CEventDispatcher.ts"/>

class CMover extends events.EventDispatcher implements IMover {

	public x = 0;
	public y = 0;
	public z = 0;

	public vx = 0;
	public vy = 0;

	public _obj:THREE.Mesh;

	public isDead:boolean = false;
	public waitRemove:boolean = false;

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

	public explode(){}

}
