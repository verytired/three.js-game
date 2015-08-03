/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="Mover.ts"/>
class Explosion extends Mover {

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

    private frameCount = 0;
    //private isFinished = false;

    constructor(x, y, color) {
        super();
        var color = arguments[2];
        if (color == undefined || color == null) {
            color = 0xFFFFFF
        }
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
            color: color,
            size: 5,
            transparent: true
        });

        this._obj.add(new THREE.PointCloud(particles, materialParticle));
        this.status = true;
        this.xDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.yDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.zDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
    }

    public init() {

    }

    public update() {

        if (this.status == true) {

            var m: any = this._obj.children[0];
            var pCount = this.totalObjects;
            while (pCount--) {
                var particle = m.geometry.vertices[pCount]
                particle.y += this.dirs[pCount].y;
                particle.x += this.dirs[pCount].x;
                particle.z += this.dirs[pCount].z;
            }
            this.frameCount++;
            if (this.frameCount > 300) {
                this.status = false;
                this.waitRemove = true;
            }
            m.geometry.verticesNeedUpdate = true;
        }
    }

}
