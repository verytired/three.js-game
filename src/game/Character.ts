class Character {
	private x = 0;
	private y = 0;
	private z = 0;

	private vx = 0;
	private vy = 0;

	//todo 描画オブジェクトを持っておく

	constructor() {
		console.log("new character");
	}

	//内部情報更新
	public update(){
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
	}

	//描画更新
	public draw(){

	}
}