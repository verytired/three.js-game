class TopView extends CView {

	private gm:GameManager;

	constructor() {
		super();
	}

	public init() {
		super.init();
		this.gm = GameManager.getInstance();
		$("#view-top").show();
	}

	public keyEvent(e:any){
		switch (e.data.keyCode) {
			case 32:
				this.moveNextScene();
				$("#view-top").hide();
				break
		}
	}

	public moveNextScene(){
		$("#overlay").hide();
		this.gm.setView(new GameView())
	}

}