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
			if(this.objs[i].isDead == true){
				this.removeCharacter(this.objs[i],i)
			}
		}
	}

	public add(obj){
		this.scene.add(obj);
	}

	public remove(obj){
		this.scene.remove(obj);
	}

	public addCharacter(chara:Character){
		this.objs.push(chara)
		this.scene.add(chara.getObject());
	}

	public removeCharacter(chara:Character,index){
		this.objs.splice(index,1);
		this.scene.remove(chara.getObject());
		chara.remove();
	}

	private getScene(){
		var gm = GameManager.getInstance();
		this.scene = gm.getScene();
	}
}
