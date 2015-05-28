class ControlManager extends events.EventDispatcher {
	private static _instance:ControlManager = null;

	constructor(){
		if(ControlManager._instance){
			throw new Error("must use the getInstance.");
		}
		super();
		ControlManager._instance = this;
		this.initialize();
	}

	public static getInstance():ControlManager {
		if(ControlManager._instance === null) {
			ControlManager._instance = new ControlManager();
		}
		return ControlManager._instance;
	}

	public initialize(){

		document.addEventListener("keydown" , (e)=>{
			var et = new events.Event("onKeyPress");
			et.data = e;
			this.dispatchEvent(et);
			//switch(e.keyCode){
			//	case 32:
			//		break
			//	case 37:
			//		console.log("left");
			//		this.dispatchEvent(new events.Event("onKeyPressLeft"));
			//		break
			//	case 38:
			//		console.log("up");
			//		this.dispatchEvent(new events.Event("onKeyPressUp"));
			//		break
			//	case 39:
			//		console.log("right");
			//		this.dispatchEvent(new events.Event("onKeyPressRight"));
			//		break
			//	case 40:
			//		console.log("down");
			//		this.dispatchEvent(new events.Event("onKeyPressDown"));
			//		break
			//
			//}
		});
	}
}