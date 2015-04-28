/// <reference path="View.ts"/>

class TestGameView extends View {

	constructor(){
		super()
	}

	public init(){
		var c = new MyCharacter()
		this.addCharacter(c);
	}

}