/**
 * Created by yutaka.sano on 2015/06/02.
 */
//敵クラス

class EnemySmall extends Enemy {

    constructor(startframe) {
        super(startframe);
    }

    public initialize() {
        this.vy = -8;
        //var material = new THREE.MeshBasicMaterial({
        //	color: this.baseColor,
        //	wireframe: true
        //});
        //this._obj.add(new THREE.Mesh(new THREE.CylinderGeometry(20,40,40,16), material));
        var materials = [
            new THREE.MeshLambertMaterial({
                color: this.baseColor,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.CylinderGeometry(20, 40, 40, 16), materials);

        this._obj.castShadow = true;
        this._obj.rotation.x = 90
        this.hitArea.push(new HitArea(20, 20, this.x, this.y))
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
        this.setShooter(new SingleShooter());
    }

    public doAction() {
        if (this.currentFrame >= this.lifeTime) {
            this.isDead = true;
            this.waitRemove = true;
        }
    }
}
