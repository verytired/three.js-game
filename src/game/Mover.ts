/// <reference path="../framework/CMover.ts"/>

class Mover extends CMover {

    public isDead: boolean = false;

    public hitArea: HitArea[] = new Array();
    public hitAreaPos: THREE.Vector2[] = new Array();

    constructor() {
        super();
    }

    public explode() {
        //todo implemation
    }

    public hitTest(hitAreaArray) {
        for (var i = 0; i < this.hitArea.length; i++) {
            for (var j = 0; j < hitAreaArray.length; j++) {
                if (this.hitArea[i].hitTest(hitAreaArray[j]) == true) {
                    return true;
                }
                if (hitAreaArray[j].hitTest(this.hitArea[i]) == true) {
                    return true;
                }
            }
        }
        return false;
    }
}
