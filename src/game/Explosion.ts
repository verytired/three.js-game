/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="Character.ts"/>

class Explosion extends Character {
	public x = 0;
	public y = 0;
	z = 0;
	public vx = 0;
	public vy = 0;

	movementSpeed = 80;
	totalObjects = 500;
	objectSize = 10;
	sizeRandomness = 4000;
	colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

	private dirs = [];
	private parts = [];

	private status = false;

	xDir = 0;
	yDir = 0;
	zDir = 0;

	private _obj:THREE.PointCloud;
	private particle;

	constructor(x, y) {
		super();
		var particles = new THREE.Geometry();
		for (var i = 0; i < this.totalObjects; i++) {

			var vertex = new THREE.Vector3();
			vertex.x = x;
			vertex.y = y;
			vertex.z = 0;

			particles.vertices.push(vertex);

			this.dirs.push({
				x: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2),
				y: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2),
				z: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2)
			});
		}

		var materialParticle = new THREE.PointCloudMaterial({
			color: 0xFF0000,
			size: 5,
			transparent: true
		});

		this._obj = new THREE.PointCloud(particles, materialParticle);
		this.status = true;
		this.xDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
		this.yDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
		this.zDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
	}

	public init() {

	}

	public update() {
		if (this.status == true) {
			var pCount = this.totalObjects;
			while (pCount--) {
				var particle = this._obj.geometry.vertices[pCount]
				particle.y += this.dirs[pCount].y;
				particle.x += this.dirs[pCount].x;
				particle.z += this.dirs[pCount].z;
			}
			this._obj.geometry.verticesNeedUpdate = true;
		}
	}

}