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

	public hitArea:HitArea[] = new Array();
	public hitAreaPos:THREE.Vector2[] = new Array();

	constructor() {
		super()
	}

	public update(nowFrame) {
	}

	public getObject() {
		return this._obj;
	}

	public remove() {

	}

	public setPosition(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this._obj.position.set(x, y, z);
	}

	public explode() {
	}

	public hitTest(hitAreaArray) {
		for (var i = 0; i < this.hitArea.length; i++) {
			for (var j = 0; j < hitAreaArray.length; j++) {
				if (this.hitArea[i].hitTest(hitAreaArray[j]) == true) {
					return true;
				}
			}
		}
		return false;
	}
}
