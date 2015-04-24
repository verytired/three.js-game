var Character = (function () {
    function Character() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        console.log("new character");
    }
    Character.prototype.update = function () {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    };
    Character.prototype.draw = function () {
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
    }
    return MyCharacter;
})(Character);
var View = (function () {
    function View() {
        console.log("new scene");
    }
    View.prototype.init = function () {
    };
    View.prototype.destructor = function () {
    };
    return View;
})();
var GameManager = (function () {
    function GameManager() {
        this.stageWidth = 640;
        this.stageHidth = 640;
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
        var c = new MyCharacter();
    };
    GameManager.prototype.update = function () {
        this.controls.update();
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
    GameManager._instance = null;
    return GameManager;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var gm = GameManager.getInstance();
    gm.animate();
});
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        _super.call(this);
    }
    return Bullet;
})(Character);
var EnemyCharacter = (function (_super) {
    __extends(EnemyCharacter, _super);
    function EnemyCharacter() {
        _super.call(this);
    }
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
