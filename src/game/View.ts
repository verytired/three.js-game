/// <reference path="Character.ts"/>
/// <reference path="GameManager.ts"/>
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

class View {

	private objs: Character[] = new Array()
	private scene:THREE.Scene;

	constructor() {
		console.log("new scene");
		this.getScene();
		this.init();
	}

	public init(){

	}

	public destructor(){

	}

	public update(){
		for(var i=0;i<this.objs.length;i++){
			this.objs[i].update()
		}
	}

	public add(obj){
		this.scene.add(obj);
	}
	public addCharacter(chara:Character){
		this.objs.push(chara)
		this.scene.add(chara.getObject());
	}

	private getScene(){
		var gm = GameManager.getInstance();
		this.scene = gm.getScene();
	}
}
