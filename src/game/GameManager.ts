/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="MyShip.ts"/>
/// <reference path="../framework/CView.ts"/>
/// <reference path="../framework/GameApp.ts"/>
/// <reference path="../framework/ControlManager.ts"/>
/// <reference path="../DefinitelyTyped/stats/stats.d.ts" />

class GameManager {

	private static _instance:GameManager = null;

	public isStop:boolean = false;
	private score = 0;
	public zPosition = 50;

	private app:GameApp;
	//dom
	private $viewScore = null;
	private $viewDebug = null;

	private sceneData:SceneData;
	private overlay:String[] = ["#view-top", "#view-gameover", "#view-stageclear"];

	constructor() {
		if (GameManager._instance) {
			throw new Error("must use the getInstance.");
		}
		GameManager._instance = this;
	}

	public static getInstance():GameManager {
		if (GameManager._instance === null) {
			GameManager._instance = new GameManager();
		}
		return GameManager._instance;
	}

	public initialize() {

		//canvas以外のdom
		this.$viewScore = $("#score");
		this.setScore(0);
		this.$viewScore.show();

		this.$viewDebug = $("#debug");
		//this.$viewDebug.hide();

		var app = GameApp.getInstance();
		var scene = app.getScene();

		//light
		var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
		directionalLight.position.set(0, -300, 300);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
		//scene.fog = new THREE.Fog(0x000000, 480,640);

		var axis = new THREE.AxisHelper(1000);
		axis.position.set(0, 0, 0);
		scene.add(axis);

		$.getJSON("data/scenedata.json", (data)=> {
			//start point
			this.sceneData = new SceneData(data);

			//$("#view-top").show();
			app.setView(new TopView());
			app.start();
		});

		this.resize();
	}

	public resize(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		for (var i = 0; i < this.overlay.length; i++) {
			$(this.overlay[i]).css({top: h / 2 - $(this.overlay[i]).height() / 2})
			$(this.overlay[i]).hide()
		}
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

	public debug(str) {
		this.$viewDebug.html(str);
	}

	//自機への参照
	private myChara;

	public setSelfCharacter(chara) {
		this.myChara = chara;
	}

	public getSelfCharacter() {
		return this.myChara
	}

	//シーン情報取得
	public getSceneData(index) {
		return this.sceneData.getData(index);
	}
}