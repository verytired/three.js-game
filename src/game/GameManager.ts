//GameManager

//theee.jsのカメラやレンダリングなどを管理する

//定義ファイル
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="MyCharacter.ts"/>
/// <reference path="View.ts"/>
/// <reference path="ControlManager.ts"/>
/// <reference path="../DefinitelyTyped/stats/stats.d.ts" />

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

	private stageWidth = 480;
	private stageHeight = 640;

	public isStop:boolean = false;

	//現在のビュー
	private currentView:View;

	private $viewScore = null;
	private $viewDebug = null;

	constructor() {
		if (GameManager._instance) {
			throw new Error("must use the getInstance.");
		}
		GameManager._instance = this;
		this.initialize();
	}

	public static getInstance():GameManager {
		if (GameManager._instance === null) {
			GameManager._instance = new GameManager();
		}
		return GameManager._instance;
	}

	public stats:Stats;

	public initialize() {
		console.log("manager initialize");
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0, 0, 300);
		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		//this.renderer.shadowMapEnabled = true;

		var container = document.getElementById('container');
		container.appendChild(this.renderer.domElement);

		//
		//var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
		//directionalLight.position.set(0, 0, 300);
		//directionalLight.castShadow = true;
		//this.scene.add(directionalLight);

		//座標軸
		var axis = new THREE.AxisHelper(1000);
		axis.position.set(0, 0, 0);
		this.scene.add(axis);

		//stats
		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.right = '0px';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild(this.stats.domElement );

		//orbitcontrol
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		//操作機能
		var ctmanager = ControlManager.getInstance();

		//canvas以外のdom
		this.$viewScore = $("#score");
		this.setScore(0);
		this.$viewScore.show();

		this.$viewDebug = $("#debug");
		this.$viewDebug.hide();

		//オブジェクト指向実装テスト
		this.setView(new TestGameView());

	}

	public update() {
		this.controls.update();
		if (this.currentView && this.isStop == false) {
			this.currentView.update();
		}
	}

	public render() {
		this.renderer.render(this.scene, this.camera);
	}

	public animate() {
		this.stats.begin();
		this.update();
		this.render();
		this.stats.end();

		requestAnimationFrame((e)=>
				this.animate()
		);

	}

	public getScene() {
		return this.scene;
	}

	public setView(v:View) {
		this.currentView = v;
	}

	public getStageSize() {
		return {width: this.stageWidth, height: this.stageHeight}
	}

	private score = 0;

	public addScore(p) {
		this.score += p;
		this.$viewScore.html("Score:"+this.score);
	}

	public setScore(p){
		this.score = p;
		this.$viewScore.html("Score:"+this.score);
	}
}