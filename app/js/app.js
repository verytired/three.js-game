var Character = (function () {
    function Character() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        console.log("new character");
    }
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
var GameManager = (function () {
    function GameManager() {
        if (GameManager._instance) {
            throw new Error("must use the getInstance.");
        }
        GameManager._instance = this;
    }
    GameManager.getInstance = function () {
        if (GameManager._instance === null) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    };
    GameManager.prototype.initialize = function () {
        console.log("manager initialize");
    };
    GameManager._instance = null;
    return GameManager;
})();
var App = (function () {
    function App() {
        this.stageWidth = 640;
        this.stageHidth = 640;
        this.onWindowResize = function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 300);
        if (WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
        }
        else {
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xFFFFFF);
        this.renderer.shadowMapEnabled = true;
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 0, 300);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 60, 50);
        cube.castShadow = true;
        this.scene.add(cube);
        var geometry2 = new THREE.CubeGeometry(20, 20, 20);
        var material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        var cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(50, 50, 50);
        cube2.castShadow = true;
        this.scene.add(cube2);
        var pGeometry = new THREE.PlaneGeometry(480, 640);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        this.scene.add(plane);
        this.camera.lookAt(plane.getWorldDirection());
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize, false);
        var c = new MyCharacter();
        var manager = GameManager.getInstance();
        manager.initialize();
    }
    App.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    App.prototype.update = function () {
        this.controls.update();
    };
    App.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
        this.update();
    };
    return App;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var main = new App();
    main.animate();
});
var Scene = (function () {
    function Scene() {
        console.log("new scene");
    }
    return Scene;
})();
