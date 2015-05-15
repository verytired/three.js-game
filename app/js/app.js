var events;
(function (events) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.listeners = {};
        }
        EventDispatcher.prototype.dispatchEvent = function (event) {
            var e;
            var type;
            if (event instanceof Event) {
                type = event.type;
                e = event;
            }
            else {
                type = event;
                e = new Event(type);
            }
            if (this.listeners[type] != null) {
                e.currentTarget = this;
                for (var i = 0; i < this.listeners[type].length; i++) {
                    var listener = this.listeners[type][i];
                    try {
                        listener.handler(e);
                    }
                    catch (error) {
                        if (window.console) {
                            console.error(error.stack);
                        }
                    }
                }
            }
        };
        EventDispatcher.prototype.addEventListener = function (type, callback, priolity) {
            if (priolity === void 0) { priolity = 0; }
            if (this.listeners[type] == null) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(new EventListener(type, callback, priolity));
            this.listeners[type].sort(function (listener1, listener2) {
                return listener2.priolity - listener1.priolity;
            });
        };
        EventDispatcher.prototype.removeEventListener = function (type, callback) {
            if (this.hasEventListener(type, callback)) {
                for (var i = 0; i < this.listeners[type].length; i++) {
                    var listener = this.listeners[type][i];
                    if (listener.equalCurrentListener(type, callback)) {
                        listener.handler = null;
                        this.listeners[type].splice(i, 1);
                        return;
                    }
                }
            }
        };
        EventDispatcher.prototype.clearEventListener = function () {
            this.listeners = {};
        };
        EventDispatcher.prototype.containEventListener = function (type) {
            if (this.listeners[type] == null)
                return false;
            return this.listeners[type].length > 0;
        };
        EventDispatcher.prototype.hasEventListener = function (type, callback) {
            if (this.listeners[type] == null)
                return false;
            for (var i = 0; i < this.listeners[type].length; i++) {
                var listener = this.listeners[type][i];
                if (listener.equalCurrentListener(type, callback)) {
                    return true;
                }
            }
            return false;
        };
        return EventDispatcher;
    })();
    events.EventDispatcher = EventDispatcher;
    var EventListener = (function () {
        function EventListener(type, handler, priolity) {
            if (type === void 0) { type = null; }
            if (handler === void 0) { handler = null; }
            if (priolity === void 0) { priolity = 0; }
            this.type = type;
            this.handler = handler;
            this.priolity = priolity;
        }
        EventListener.prototype.equalCurrentListener = function (type, handler) {
            if (this.type == type && this.handler == handler) {
                return true;
            }
            return false;
        };
        return EventListener;
    })();
    var Event = (function () {
        function Event(type, value) {
            if (type === void 0) { type = null; }
            if (value === void 0) { value = null; }
            this.type = type;
            this.value = value;
        }
        Event.COMPLETE = "complete";
        Event.CHANGE_PROPERTY = "changeProperty";
        return Event;
    })();
    events.Event = Event;
})(events || (events = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.isDead = false;
    }
    Character.prototype.update = function () {
    };
    Character.prototype.getObject = function () {
        return this._obj;
    };
    Character.prototype.remove = function () {
    };
    return Character;
})(events.EventDispatcher);
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
        var geometry = new THREE.BoxGeometry(20, 20, 20);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this._obj = new THREE.Mesh(geometry, material);
        this._obj.castShadow = true;
    }
    MyCharacter.prototype.update = function () {
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
            if (this.objs[i].isDead == true) {
                this.removeCharacter(this.objs[i], i);
            }
        }
    };
    View.prototype.add = function (obj) {
        this.scene.add(obj);
    };
    View.prototype.remove = function (obj) {
        this.scene.remove(obj);
    };
    View.prototype.addCharacter = function (chara) {
        this.objs.push(chara);
        this.scene.add(chara.getObject());
    };
    View.prototype.removeCharacter = function (chara, index) {
        this.objs.splice(index, 1);
        this.scene.remove(chara.getObject());
        chara.remove();
    };
    View.prototype.getScene = function () {
        var gm = GameManager.getInstance();
        this.scene = gm.getScene();
    };
    View.prototype.removeAll = function () {
        for (var i = 0; i < this.objs.length; i++) {
            this.scene.remove(this.objs[i].getObject());
            this.objs[i].remove();
        }
    };
    return View;
})();
var ControlManager = (function (_super) {
    __extends(ControlManager, _super);
    function ControlManager() {
        if (ControlManager._instance) {
            throw new Error("must use the getInstance.");
        }
        _super.call(this);
        ControlManager._instance = this;
        this.initialize();
    }
    ControlManager.getInstance = function () {
        if (ControlManager._instance === null) {
            ControlManager._instance = new ControlManager();
        }
        return ControlManager._instance;
    };
    ControlManager.prototype.initialize = function () {
        var _this = this;
        document.addEventListener("keydown", function (e) {
            var et = new events.Event("onKeyPress");
            et.data = e;
            _this.dispatchEvent(et);
        });
    };
    ControlManager._instance = null;
    return ControlManager;
})(events.EventDispatcher);
var GameManager = (function () {
    function GameManager() {
        this.stageWidth = 480;
        this.stageHeight = 640;
        this.isStop = false;
        this.$viewScore = null;
        this.$viewDebug = null;
        this.score = 0;
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
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        var ctmanager = ControlManager.getInstance();
        this.$viewScore = $("#score");
        this.setScore(0);
        this.$viewScore.show();
        this.$viewDebug = $("#debug");
        this.$viewDebug.hide();
        this.setView(new TestGameView());
    };
    GameManager.prototype.update = function () {
        this.controls.update();
        if (this.currentView && this.isStop == false) {
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
    GameManager.prototype.getStageSize = function () {
        return { width: this.stageWidth, height: this.stageHeight };
    };
    GameManager.prototype.addScore = function (p) {
        this.score += p;
        this.$viewScore.html("Score:" + this.score);
    };
    GameManager.prototype.setScore = function (p) {
        this.score = p;
        this.$viewScore.html("Score:" + this.score);
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
        this.stageWidth = 0;
        this.stageHeight = 0;
        var s = GameManager.getInstance().getStageSize();
        this.stageWidth = s.width;
        this.stageHeight = s.height;
        this.vy = 6;
        this._obj = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshPhongMaterial({
            color: 0xffffff
        }));
        this._obj.position.set(0, 60, 50);
        this._obj.castShadow = true;
    }
    Bullet.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.checkAreaTest();
        this._obj.position.set(this.x, this.y, 50);
    };
    Bullet.prototype.checkAreaTest = function () {
        if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
            this.isDead = true;
        }
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
        this.stageWidth = 0;
        this.stageHeight = 0;
        this.point = 150;
        this.vy = -2;
        var material = new THREE.MeshLambertMaterial({ color: 0x008866, wireframe: false });
        this._obj = new THREE.Mesh(new THREE.TetrahedronGeometry(20), material);
        this._obj.castShadow = true;
        var s = GameManager.getInstance().getStageSize();
        this.stageWidth = s.width;
        this.stageHeight = s.height;
    }
    EnemyCharacter.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.checkAreaTest();
        this._obj.position.set(this.x, this.y, 50);
    };
    EnemyCharacter.prototype.checkAreaTest = function () {
        if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
            this.isDead = true;
        }
    };
    return EnemyCharacter;
})(Character);
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y) {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.movementSpeed = 80;
        this.totalObjects = 500;
        this.objectSize = 10;
        this.sizeRandomness = 4000;
        this.colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
        this.dirs = [];
        this.parts = [];
        this.status = false;
        this.xDir = 0;
        this.yDir = 0;
        this.zDir = 0;
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
        this._pc = new THREE.PointCloud(particles, materialParticle);
        this.status = true;
        this.xDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.yDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.zDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
    }
    Explosion.prototype.init = function () {
    };
    Explosion.prototype.getParticles = function () {
        return this._pc;
    };
    Explosion.prototype.update = function () {
        if (this.status == true) {
            var pCount = this.totalObjects;
            while (pCount--) {
                var particle = this._pc.geometry.vertices[pCount];
                particle.y += this.dirs[pCount].y;
                particle.x += this.dirs[pCount].x;
                particle.z += this.dirs[pCount].z;
            }
            this._pc.geometry.verticesNeedUpdate = true;
        }
    };
    return Explosion;
})(Character);
var MenuView = (function (_super) {
    __extends(MenuView, _super);
    function MenuView() {
        _super.call(this);
    }
    return MenuView;
})(View);
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
        this.enemies = new Array();
        this.bullets = new Array();
        this.explosions = new Array();
        this.waitingRestart = false;
        this.timerId = 0;
    }
    TestGameView.prototype.init = function () {
        var _this = this;
        this.gm = GameManager.getInstance();
        var pGeometry = new THREE.PlaneBufferGeometry(480, 640);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        this.add(plane);
        var cm = ControlManager.getInstance();
        cm.addEventListener("onKeyPress", function (e) {
            switch (e.data.keyCode) {
                case 32:
                    var b = new Bullet();
                    b.x = _this.self.x;
                    b.y = _this.self.y;
                    _this.addCharacter(b);
                    _this.bullets.push(b);
                    break;
                case 65:
                    console.log("left");
                    _this.self.x -= 10;
                    break;
                case 87:
                    console.log("up");
                    _this.self.y += 10;
                    break;
                case 68:
                    console.log("right");
                    _this.self.x += 10;
                    break;
                case 83:
                    console.log("down");
                    _this.self.y -= 10;
                    break;
            }
        });
        this.startGame();
    };
    TestGameView.prototype.update = function () {
        this.hitTest();
        this.checkLiveTest();
        _super.prototype.update.call(this);
        for (var i = 0; i < this.explosions.length; i++) {
            this.explosions[i].update();
        }
    };
    TestGameView.prototype.hitTest = function () {
        for (var i = 0; i < this.bullets.length; i++) {
            for (var j = 0; j < this.enemies.length; j++) {
                if (this.bullets[i].x > this.enemies[j].x - 15 && this.bullets[i].x < this.enemies[j].x + 15 && this.bullets[i].y > this.enemies[j].y - 15 && this.bullets[i].y < this.enemies[j].y + 15) {
                    this.bullets[i].isDead = true;
                    this.enemies[j].isDead = true;
                    this.gm.addScore(this.enemies[j].point);
                    var ex = new Explosion(this.enemies[j].x, this.enemies[j].y);
                    this.add(ex.getParticles());
                    this.explosions.push(ex);
                }
            }
        }
        for (var j = 0; j < this.enemies.length; j++) {
            if (this.self.x > this.enemies[j].x - 15 && this.self.x < this.enemies[j].x + 15 && this.self.y > this.enemies[j].y - 15 && this.self.y < this.enemies[j].y + 15) {
                if (!this.self.isDead) {
                    this.self.isDead = true;
                    var ex = new Explosion(this.self.x, this.self.y);
                    this.add(ex.getParticles());
                    this.explosions.push(ex);
                }
            }
        }
    };
    TestGameView.prototype.checkLiveTest = function () {
        var _this = this;
        if (this.self.isDead == true && this.waitingRestart == false) {
            this.waitingRestart = true;
            setTimeout(function () {
                _this.restart();
            }, 3000);
            return;
        }
        var n = 0;
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[n].isDead == true) {
                this.bullets.splice(n, 1);
            }
            else {
                n++;
            }
        }
        n = 0;
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[n].isDead == true) {
                this.enemies.splice(n, 1);
            }
            else {
                n++;
            }
        }
    };
    TestGameView.prototype.setGameOver = function () {
    };
    TestGameView.prototype.startGame = function () {
        var _this = this;
        this.self = new MyCharacter();
        this.self.y = -150;
        this.addCharacter(this.self);
        var func = function () {
            _this.timerId = setTimeout(function () {
                var e = new EnemyCharacter();
                e.y = 320;
                e.x = -320 + Math.random() * 640;
                _this.addCharacter(e);
                _this.enemies.push(e);
                func();
            }, 500);
        };
        func();
    };
    TestGameView.prototype.restart = function () {
        console.log("restart");
        this.waitingRestart = false;
        clearTimeout(this.timerId);
        this.removeAll();
        this.bullets.length = 0;
        this.enemies.length = 0;
        this.gm.setScore(0);
        this.startGame();
    };
    return TestGameView;
})(View);
