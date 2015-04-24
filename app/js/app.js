var MyCharacter = (function () {
    function MyCharacter() {
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
    MyCharacter.prototype.getObject = function () {
        return this._obj;
    };
    MyCharacter.prototype.update = function () {
        this.y += this.vy;
        this._obj.position.set(this.x, this.y, 50);
    };
    return MyCharacter;
})();
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
        var c = new MyCharacter();
        this.scene.add(c.getObject());
        this.objs.push(c);
    };
    GameManager.prototype.update = function () {
        this.controls.update();
        console.log("update");
        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].update();
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
    GameManager._instance = null;
    return GameManager;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var gm = GameManager.getInstance();
    gm.animate();
});
var Bullet = (function () {
    function Bullet() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
    }
    Bullet.prototype.update = function () {
    };
    return Bullet;
})();
var EnemyCharacter = (function () {
    function EnemyCharacter() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
    }
    EnemyCharacter.prototype.update = function () {
    };
    return EnemyCharacter;
})();
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
