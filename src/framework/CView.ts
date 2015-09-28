/// <reference path="CMover.ts"/>
/// <reference path="../game/GameManager.ts"/>
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />

class CView {

    private objs: CMover[] = new Array();
    private scene: THREE.Scene;
    private scene2d: THREE.Scene;

    public app: GameApp;
    private cm: ControlManager;

    private _keyEvent: Function;
    private _onMouseDown: Function;
    private _onMouseMove: Function;
    private _onMouseUp: Function;

    constructor() {
        this.app = GameApp.getInstance();
        this.scene = this.app.getScene();
        this.scene2d = this.app.getScene2d();
        this.cm = ControlManager.getInstance();
        this._keyEvent = (e) => {
            this.keyEvent(e);
        };
        this._onMouseDown = (e) => {
            this.onMouseDown(e);
        };
        this._onMouseMove = (e) => {
            this.onMouseMove(e);
        };
        this._onMouseUp = (e) => {
            this.onMouseUp(e);
        };
        this.cm.addEventListener("onKeyPress", this._keyEvent);
        this.cm.addEventListener("onMouseDown", this._onMouseDown);
        this.cm.addEventListener("onMouseMove", this._onMouseMove);
        this.cm.addEventListener("onMouseUp", this._onMouseUp);
    }

    public destructor() {
        this.removeAll();
        this.cm.removeEventListener("onKeyPress", this._keyEvent);
        this.cm.removeEventListener("onMouseDown", this._onMouseDown);
        this.cm.removeEventListener("onMouseMove", this._onMouseMove);
        this.cm.removeEventListener("onMouseUp", this._onMouseUp);
    }

    public update(nowFrame) {
        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].update(nowFrame);
            if (this.objs[i].waitRemove == true) {
                this.removeMover(this.objs[i], i);
            }
        }
    }

    public add(obj: THREE.Object3D) {
        this.scene.add(obj);
    }

    public add2d(obj: THREE.Object3D) {
        this.scene2d.add(obj);
    }

    public remove(obj) {
        this.scene.remove(obj);
    }

    public remove2d(obj) {
        this.scene2d.remove(obj);
    }

    public addMover(chara: CMover) {
        this.objs.push(chara);
        this.scene.add(chara.getObject());
    }

    public removeMover(chara: CMover, index) {
        this.objs.splice(index, 1);
        this.scene.remove(chara.getObject());
        chara.remove();
    }

    public removeAll() {
        for (var i = 0; i < this.objs.length; i++) {
            this.scene.remove(this.objs[i].getObject());
            this.objs[i].remove();
        }

        if (this.scene2d.children.length > 0) {
            while (this.scene2d.children.length > 0) {
                this.scene2d.remove(this.scene2d.children[this.scene2d.children.length - 1]);
            }
        }
    }

    public resize() {
        //
    }

    public keyEvent(e: any) {
        //
    }

    public onMouseDown(e: any) {
        //
    }

    public onMouseMove(e: any) {
        //
    }

    public onMouseUp(e: any) {
        //
    }
}
