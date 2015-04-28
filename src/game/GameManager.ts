//GameManager

//theee.jsのカメラやレンダリングなどを管理する

//定義ファイル
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="MyCharacter.ts"/>
/// <reference path="View.ts"/>
/// <reference path="ControlManager.ts"/>

declare module THREE {
	export var OrbitControls;
	export var TrackballControls;
}

class GameManager {

	private static _instance:GameManager = null;

	private scene:THREE.Scene;
	private camera:THREE.PerspectiveCamera;
	private renderer;
	private controls;

	private stageWidth = 640;
	private stageHidth = 640;

	//現在のビュー
	private currentView:View;

	constructor() {
		if(GameManager._instance){
			throw new Error("must use the getInstance.");
		}
		GameManager._instance = this;
		this.initialize();
	}

	public static getInstance():GameManager {
		if(GameManager._instance === null) {
			GameManager._instance = new GameManager();
		}
		return GameManager._instance;
	}

	public initialize() {
		console.log("manager initialize");
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0, 0, 300);
		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xFFFFFF);
		this.renderer.shadowMapEnabled = true;

		var container = document.getElementById('container');
		container.appendChild(this.renderer.domElement);

		var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
		directionalLight.position.set(0, 0, 300);
		directionalLight.castShadow = true;
		this.scene.add(directionalLight);

		//座標軸()
		var axis = new THREE.AxisHelper(1000);
		axis.position.set(0, 0, 0);
		this.scene.add(axis);

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		//操作機能
		var ctmanager = ControlManager.getInstance();

		//オブジェクト指向実装テスト
		this.setView(new TestGameView());

	}

	public update(){
		this.controls.update();
		//this.currentView.update();
		if(this.currentView){
			this.currentView.update()
		}
	}

	public render(){
		this.renderer.render(this.scene, this.camera);
	}

	public animate() {
		requestAnimationFrame((e)=>
				this.animate()
		);
		this.update();
		this.render();
	}

	public getScene(){
		return this.scene;
	}

	public setView(v:View){
		this.currentView = v;
	}

}