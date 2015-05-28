/// <reference path="Character.ts"/>
/// <reference path="../game/GameManager.ts"/>
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

class View {

	private objs:Character[] = new Array()
	private scene:THREE.Scene;

	private cm:ControlManager;

	constructor() {
		console.log("new scene");
		this.getScene();
		this.init();
	}

	private _func:Function;
	public init() {
		this.cm = ControlManager.getInstance();
		this._func = (e)=>{
			this.keyEvent(e);
		}
		this.cm.addEventListener("onKeyPress",this._func);
	}

	public destructor() {
		this.removeAll();
		this.cm.removeEventListener("onKeyPress",this._func);
	}

	public update(nowFrame) {
		for (var i = 0; i < this.objs.length; i++) {
			this.objs[i].update(nowFrame);
			if (this.objs[i].isDead == true) {
				this.removeCharacter(this.objs[i], i)
			}
		}
	}

	public add(obj) {
		this.scene.add(obj);
	}

	public remove(obj) {
		this.scene.remove(obj);
	}

	public addCharacter(chara:Character) {
		this.objs.push(chara)
		this.scene.add(chara.getObject());
	}

	public removeCharacter(chara:Character, index) {
		this.objs.splice(index, 1);
		this.scene.remove(chara.getObject());
		chara.remove();
	}

	private getScene() {
		var gm = GameManager.getInstance();
		this.scene = gm.getScene();
	}

	public removeAll() {
		for (var i = 0; i < this.objs.length; i++) {
			this.scene.remove(this.objs[i].getObject());
			this.objs[i].remove();
		}
	}

	public keyEvent(e:any){}
}
