//GameManager

//theee.jsのカメラやレンダリングなどを管理する

//定義ファイル
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="MyCharacter.ts"/>
/// <reference path="View.ts"/>

declare module THREE {
	export var OrbitControls;
	export var TrackballControls;
}

class GameManager {

	private static _instance:GameManager = null;

	//現在のビュー
	private currentView:View;
	//
	private scene:THREE.Scene;
	private camera:THREE.PerspectiveCamera;
	private renderer;
	private controls;

	private stageWidth = 640;
	private stageHidth = 640;

	private objs: Character[] = new Array()

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

		var pGeometry = new THREE.PlaneGeometry(480, 640);
		var pMaterial = new THREE.MeshLambertMaterial({
			color: 0x999999,
			side: THREE.DoubleSide
		});

		//座標軸()
		var axis = new THREE.AxisHelper(1000);
		axis.position.set(0, 0, 0);
		this.scene.add(axis);

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		//以下テスト実装
		var plane = new THREE.Mesh(pGeometry, pMaterial);
		plane.position.set(0, 0, 0);
		//plane.rotation.x = 90 * Math.PI / 180;
		plane.receiveShadow = true;
		this.scene.add(plane);

		var c = new MyCharacter();
		this.scene.add(c.getObject());
		//this.currentView = null;

		this.objs.push(c);
	}


	public update(){
		this.controls.update();
		//this.currentView.update();
		console.log("update")
		for(var i=0;i<this.objs.length;i++){
			this.objs[i].update();
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

}