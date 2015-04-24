//ゲームマネージャークラス
//theee.jsのカメラやレンダリングなどを管理する

class GameManager {

	private static _instance:GameManager = null;

	constructor() {
		if(GameManager._instance){
			throw new Error("must use the getInstance.");
		}
		GameManager._instance = this;
	}
	public static getInstance():GameManager {
		if(GameManager._instance === null) {
			GameManager._instance = new GameManager();
		}
		return GameManager._instance;
	}

	public initialize() {
		console.log("manager initialize");
	}

}