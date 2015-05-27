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

interface Window {
	webkitRequestAnimationFrame: any;
	mozRequestAnimationFrame: any;
	oRequestAnimationFrame: any;

}

interface Performance {
	mozNow: any;
	msNow: any;
	oNow: any;
	webkitNow: any;
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

	private score = 0;

	//現在のビュー
	private currentView:View;

	//dom
	private $viewScore = null;
	private $viewDebug = null;

	//stats用
	public stats:Stats;

	//タイマー管理
	private startTime = 0;
	private currentFrame = 0;
	private requestAnimationFrame;
	private getTime;
	private fps = 60.0;
	private frameLength = 60.0;

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

		//var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
		//directionalLight.position.set(0, 0, 300);
		//directionalLight.castShadow = true;
		//this.scene.add(directionalLight);

		//タイマ管理設定
		this.requestAnimationFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000.0 / 60.0);
				};
		})();
		var now = window.performance && (
			performance.now ||
			performance.mozNow ||
			performance.msNow ||
			performance.oNow ||
			performance.webkitNow );
		this.getTime = function () {
			return ( now && now.call(performance) ) || ( new Date().getTime() );
		}
		this.startTime = this.getTime();

		//座標軸
		var axis = new THREE.AxisHelper(1000);
		axis.position.set(0, 0, 0);
		this.scene.add(axis);

		/*** ADDING SCREEN SHOT ABILITY ***/
		window.addEventListener("keyup", (e)=> {
			var imgData, imgNode;
			//Listen to 'P' key
			if (e.which !== 80) return;
			try {
				imgData = this.renderer.domElement.toDataURL();
				console.log(imgData);
			}
			catch (e) {
				console.log(e)
				console.log("Browser does not support taking screenshot of 3d context");
				return;
			}
		});

		//stats
		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.right = '0px';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild(this.stats.domElement);

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

		$.getJSON("data/scenedata.json" , (data)=> {
			//start point
			//オブジェクト指向実装テスト
			this.setView(new TestGameView(data));
		});
		//this.setView(new TestGameView(data));
	}

	public update() {
		this.controls.update();
		if (this.currentView && this.isStop == false) {
			this.currentView.update(this.currentFrame);
		}
	}

	public render() {
		this.renderer.render(this.scene, this.camera);
	}

	public animate() {

		this.currentFrame = Math.floor(( this.getTime() - this.startTime ) / ( 1000.0 / this.fps ));
		//console.log(this.currentFrame);

		this.stats.begin();
		this.update();
		this.render();
		this.stats.end();

		requestAnimationFrame((e)=> {
				this.animate();
			}
		);

	}

	public setStartTime(){
		this.startTime = this.getTime();
		this.currentFrame = 0;
	}

	public getScene() {
		return this.scene;
	}

	public setView(v:View) {
		this.currentView = v;
	}

	//stageサイズ返却
	public getStageSize() {
		return {width: this.stageWidth, height: this.stageHeight}
	}

	//スコア計算
	public addScore(p) {
		this.score += p;
		this.$viewScore.html("Score:" + this.score);
	}

	public setScore(p) {
		this.score = p;
		this.$viewScore.html("Score:" + this.score);
	}

	//viewへの参照
	public getCurrentFrame(){
		return this.currentFrame;
	}

	public getCurrentView(){
		return this.currentView
	}

	//自機への参照
	private myChara;
	public setSelfCharacter(chara){
		this.myChara = chara;
	}
	public getSelfCharacter(){
		return this.myChara
	}
}