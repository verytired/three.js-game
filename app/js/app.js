var Character = (function () {
    function Character() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
    }
    Character.prototype.update = function () {
    };
    Character.prototype.getObject = function () {
        return this._obj;
    };
    return Character;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MyCharacter = (function (_super) {
    __extends(MyCharacter, _super);
    function MyCharacter() {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vy = -2;
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this._obj = new THREE.Mesh(geometry, material);
        this._obj.position.set(0, 60, 50);
        this._obj.castShadow = true;
    }
    MyCharacter.prototype.update = function () {
        this.y += this.vy;
        this._obj.position.set(this.x, this.y, 50);
    };
    return MyCharacter;
})(Character);
var View = (function () {
    function View() {
        this.objs = new Array();
        console.log("new scene");
        this.getScene();
        this.init();
    }
    View.prototype.init = function () {
    };
    View.prototype.destructor = function () {
    };
    View.prototype.update = function () {
        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].update();
        }
    };
    View.prototype.addCharacter = function (chara) {
        this.objs.push(chara);
        this.scene.add(chara.getObject());
    };
    View.prototype.getScene = function () {
        var gm = GameManager.getInstance();
        this.scene = gm.getScene();
    };
    return View;
})();
var GameManager = (function () {
    function GameManager() {
        this.stageWidth = 640;
        this.stageHidth = 640;
        this.objs = new Array();
        if (GameManager._instance) {
            throw new Error("must use the getInstance.");
        }
        GameManager._instance = this;
        this.initialize();
    }
    GameManager.getInstance = function () {
        if (GameManager._instance === null) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    };
    GameManager.prototype.initialize = function () {
        console.log("manager initialize");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 300);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xFFFFFF);
        this.renderer.shadowMapEnabled = true;
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 0, 300);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        var pGeometry = new THREE.PlaneGeometry(480, 640);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999,
            side: THREE.DoubleSide
        });
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        this.scene.add(plane);
        this.setView(new TestGameView());
    };
    GameManager.prototype.update = function () {
        this.controls.update();
        if (this.currentView) {
            this.currentView.update();
        }
    };
    GameManager.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    GameManager.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.update();
        this.render();
    };
    GameManager.prototype.getScene = function () {
        return this.scene;
    };
    GameManager.prototype.setView = function (v) {
        this.currentView = v;
    };
    GameManager._instance = null;
    return GameManager;
})();
window.addEventListener("load", function (e) {
    var gm = GameManager.getInstance();
    gm.animate();
});
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
    }
    Bullet.prototype.update = function () {
    };
    return Bullet;
})(Character);
var EnemyCharacter = (function (_super) {
    __extends(EnemyCharacter, _super);
    function EnemyCharacter() {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
    }
    EnemyCharacter.prototype.update = function () {
    };
    return EnemyCharacter;
})(Character);
var Scene = (function () {
    function Scene() {
        console.log("new scene");
    }
    Scene.prototype.init = function () {
    };
    Scene.prototype.destructor = function () {
    };
    return Scene;
})();
var Stage = (function () {
    function Stage() {
        console.log("new scene");
    }
    Stage.prototype.init = function () {
    };
    Stage.prototype.destructor = function () {
    };
    return Stage;
})();
var TestGameView = (function (_super) {
    __extends(TestGameView, _super);
    function TestGameView() {
        _super.call(this);
    }
    TestGameView.prototype.init = function () {
        var c = new MyCharacter();
        this.addCharacter(c);
    };
    return TestGameView;
})(View);
