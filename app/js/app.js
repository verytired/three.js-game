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
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
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
        this.renderer.setClearColor(0x000000);
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
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
var SimplexNoise = (function () {
    function SimplexNoise(r) {
        if (r === void 0) { r = undefined; }
        if (r == undefined)
            r = Math;
        this.grad3 = [
            [1, 1, 0],
            [-1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [1, 0, 1],
            [-1, 0, 1],
            [1, 0, -1],
            [-1, 0, -1],
            [0, 1, 1],
            [0, -1, 1],
            [0, 1, -1],
            [0, -1, -1]
        ];
        this.p = [];
        for (var i = 0; i < 256; i++) {
            this.p[i] = Math.floor(r.random() * 256);
        }
        this.perm = [];
        for (var i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
        this.simplex = [
            [0, 1, 2, 3],
            [0, 1, 3, 2],
            [0, 0, 0, 0],
            [0, 2, 3, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 2, 3, 0],
            [0, 2, 1, 3],
            [0, 0, 0, 0],
            [0, 3, 1, 2],
            [0, 3, 2, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 3, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 2, 0, 3],
            [0, 0, 0, 0],
            [1, 3, 0, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 3, 0, 1],
            [2, 3, 1, 0],
            [1, 0, 2, 3],
            [1, 0, 3, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 3, 1],
            [0, 0, 0, 0],
            [2, 1, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 1, 3],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [3, 0, 1, 2],
            [3, 0, 2, 1],
            [0, 0, 0, 0],
            [3, 1, 2, 0],
            [2, 1, 0, 3],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [3, 1, 0, 2],
            [0, 0, 0, 0],
            [3, 2, 0, 1],
            [3, 2, 1, 0]
        ];
    }
    SimplexNoise.prototype.dot = function (g, x, y) {
        return g[0] * x + g[1] * y;
    };
    SimplexNoise.prototype.dot3d = function (g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    };
    SimplexNoise.prototype.noise = function (xin, yin) {
        var n0, n1, n2;
        var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        var s = (xin + yin) * F2;
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        var t = (i + j) * G2;
        var X0 = i - t;
        var Y0 = j - t;
        var x0 = xin - X0;
        var y0 = yin - Y0;
        var i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else {
            i1 = 0;
            j1 = 1;
        }
        var x1 = x0 - i1 + G2;
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2;
        var y2 = y0 - 1.0 + 2.0 * G2;
        var ii = i & 255;
        var jj = j & 255;
        var gi0 = this.perm[ii + this.perm[jj]] % 12;
        var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0)
            n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0)
            n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0)
            n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    };
    SimplexNoise.prototype.noise3d = function (xin, yin, zin) {
        var n0, n1, n2, n3;
        var F3 = 1.0 / 3.0;
        var s = (xin + yin + zin) * F3;
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var G3 = 1.0 / 6.0;
        var t = (i + j + k) * G3;
        var X0 = i - t;
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0;
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        var i1, j1, k1;
        var i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        }
        else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        var x1 = x0 - i1 + G3;
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3;
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3;
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
        var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
        var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
        var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0)
            n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot3d(this.grad3[gi0], x0, y0, z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0)
            n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot3d(this.grad3[gi1], x1, y1, z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0)
            n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot3d(this.grad3[gi2], x2, y2, z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0)
            n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.dot3d(this.grad3[gi3], x3, y3, z3);
        }
        return 32.0 * (n0 + n1 + n2 + n3);
    };
    return SimplexNoise;
})();
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
        this._obj = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
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
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
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
        this.isKeyLock = false;
    }
    TestGameView.prototype.init = function () {
        var _this = this;
        this.gm = GameManager.getInstance();
        var pGeometry = new THREE.PlaneBufferGeometry(480, 640);
        var pMaterial = new THREE.MeshBasicMaterial({
            color: 0x999999,
            side: THREE.DoubleSide,
            wireframe: true
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        var geometry2 = new THREE.PlaneGeometry(480, 640, 128, 128);
        var material2 = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
        var ground = new THREE.Mesh(geometry2, material2);
        this.add(ground);
        var pn = new SimplexNoise();
        for (var i = 0; i < geometry2.vertices.length; i++) {
            var vertex = geometry2.vertices[i];
            vertex.z = pn.noise(vertex.x / 5, vertex.y / 5);
        }
        geometry2.computeFaceNormals();
        geometry2.computeVertexNormals();
        var cm = ControlManager.getInstance();
        cm.addEventListener("onKeyPress", function (e) {
            if (_this.isKeyLock == true) {
                return;
            }
            switch (e.data.keyCode) {
                case 32:
                    if (_this.waitingRestart == true) {
                        _this.restart();
                        return;
                    }
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
            this.isKeyLock = true;
            setTimeout(function () {
                _this.isKeyLock = false;
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
