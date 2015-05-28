/// <reference path="../utils/SimplexNoise.ts"/>

class Stage extends CMover{

	constructor() {
		super();
	}

	public init(){

		//create background
		//var pGeometry = new THREE.PlaneBufferGeometry(480, 1280);
		//var pMaterial = new THREE.MeshBasicMaterial({
		//	color: 0x999999,
		//	side: THREE.DoubleSide,
		//	wireframe:true
		//});
		//this._obj = new THREE.Mesh(pGeometry, pMaterial);
		var geometry2 = new THREE.PlaneGeometry(480,1280, 48, 128);
		var material2 = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
		this._obj = new THREE.Mesh(geometry2, material2);

		//var pn = new SimplexNoise();
		//for (var i = 0; i < geometry2.vertices.length; i++) {
		//	var vertex = geometry2.vertices[ i ];
		//	vertex.z = pn.noise(vertex.x /5 , vertex.y / 5);
		//}
		//geometry2.computeFaceNormals();
		//geometry2.computeVertexNormals();

		this._obj.position.set(0, 0, 0);
		this.vy = -1;
	}

	public destructor(){

	}

	public update() {
		this.y += this.vy
		if(this.y <= -320){
			this.y = 0
		}
		this._obj.position.set(this.x, this.y, 0);
	}

}
