class TopView extends CView {

	constructor() {
		super();
	}

	public init() {
		super.init();
		$("#view-top").show();

		this.resize();
	}

	public keyEvent(e:any){
		switch (e.data.keyCode) {
			case 32:
				this.moveNextScene();
				$("#view-top").hide();
				break
		}
	}

	public onMouseDown(e:any) {
		this.moveNextScene();
		$("#view-top").hide();
	}

	public moveNextScene(){
		$("#overlay").hide();
		this.app.setView(new GameView())
	}

}