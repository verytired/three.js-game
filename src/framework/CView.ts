/// <reference path="CMover.ts"/>
/// <reference path="../game/GameManager.ts"/>
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

class CView {

	private objs:CMover[] = new Array()
	private scene:THREE.Scene;

	public app:GameApp;
	private cm:ControlManager;

	constructor() {
		this.init();
	}

	private _keyEvent:Function;
	private _onMouseDown:Function;
	private _onMouseMove:Function;
	private _onMouseUp:Function;

	public init() {
		this.app = GameApp.getInstance();
		this.scene = this.app.getScene();
		this.cm = ControlManager.getInstance();
		this._keyEvent = (e)=> {
			this.keyEvent(e);
		}
		this._onMouseDown = (e)=> {
			this.onMouseDown(e);
		}
		this._onMouseMove = (e)=> {
			this.onMouseMove(e);
		}
		this._onMouseUp = (e)=> {
			this.onMouseUp(e);
		}
		this.cm.addEventListener("onKeyPress", this._keyEvent);
		this.cm.addEventListener("onMouseDown", this._onMouseDown);
		this.cm.addEventListener("onMouseMove", this._onMouseMove);
		this.cm.addEventListener("onMouseUp", this._onMouseUp);
	}

	public destructor() {
		this.removeAll();
		this.cm.removeEventListener("onKeyPress", this._keyEvent);
		this.cm.removeEventListener("onMouseDown", this._onMouseDown);
		this.cm.removeEventListener("onMouseMove", this._onMouseMove);
		this.cm.removeEventListener("onMouseUp", this._onMouseUp);
	}

	public update(nowFrame) {
		for (var i = 0; i < this.objs.length; i++) {
			this.objs[i].update(nowFrame);
			if (this.objs[i].waitRemove == true) {
				this.removeMover(this.objs[i], i)
			}
		}
	}

	public add(obj) {
		this.scene.add(obj);
	}

	public remove(obj) {
		this.scene.remove(obj);
	}

	public addMover(chara:CMover) {
		this.objs.push(chara)
		this.scene.add(chara.getObject());
	}

	public removeMover(chara:CMover, index) {
		this.objs.splice(index, 1);
		this.scene.remove(chara.getObject());
		chara.remove();
	}

	public removeAll() {
		for (var i = 0; i < this.objs.length; i++) {
			this.scene.remove(this.objs[i].getObject());
			this.objs[i].remove();
		}
	}

	public resize(){}

	public keyEvent(e:any) {
	}

	public onMouseDown(e:any) {
	}

	public onMouseMove(e:any) {
	}

	public onMouseUp(e:any) {
	}
}
