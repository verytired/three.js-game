class TopView extends CView {

	constructor() {
		super();
		//$("#view-top").show();
		//this.resize();

		//todo test 2d
		THREE.ImageUtils.loadTexture("image/ui/title.png", {},  (texture)=> {
			texture.minFilter = THREE.NearestFilter;
			var material = new THREE.SpriteMaterial({map: texture, color: 0xFFFFFF});
			var w = texture.image.width, h = texture.image.height;
			texture.flipY = false;
			var sprite = new THREE.Sprite(material);
			sprite.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5-100, -1);
			sprite.scale.set(w, h, 1);
			sprite.scale.y = h
			this.add2d(sprite);
		})
		THREE.ImageUtils.loadTexture("image/ui/press_space.png", {},  (texture)=> {
			texture.minFilter = THREE.NearestFilter;
			var material = new THREE.SpriteMaterial({map: texture, color: 0xFFFFFF});
			var w = texture.image.width, h = texture.image.height;
			texture.flipY = false;
			var sprite = new THREE.Sprite(material);
			sprite.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5+100, -3);
			sprite.scale.set(w, h, 1);
			sprite.scale.y = h
			this.add2d(sprite);
		})
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