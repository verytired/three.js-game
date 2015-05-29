//敵クラス
/// <reference path="GameManager.ts"/>

class EnemyMid extends Enemy {



    constructor(startframe) {
        super(startframe);

    }

    public initialize() {

        this.vy = -6;

        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        this._obj = new THREE.Mesh(new THREE.TetrahedronGeometry(40), material);
        this._obj.castShadow = true;
        this.setShooter(new SingleShooter());
        this.setLife(3);
        this.setBaseColor(0x00ff00);
    }

}
