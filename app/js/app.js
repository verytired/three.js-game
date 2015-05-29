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
var CMover = (function (_super) {
    __extends(CMover, _super);
    function CMover() {
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.isDead = false;
        this.waitRemove = false;
    }
    CMover.prototype.update = function (nowFrame) {
    };
    CMover.prototype.getObject = function () {
        return this._obj;
    };
    CMover.prototype.remove = function () {
    };
    CMover.prototype.setPosition = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    CMover.prototype.explode = function () {
    };
    return CMover;
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
        this.explosionObj = null;
        this.vy = -2;
        var geometry = new THREE.BoxGeometry(20, 20, 20);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        this._obj = new THREE.Mesh(geometry, material);
        this._obj.castShadow = true;
    }
    MyCharacter.prototype.update = function (nowFrame) {
        this._obj.position.set(this.x, this.y, 50);
        if (this.explosionObj != null) {
            this.explosionObj.update(nowFrame);
            if (this.explosionObj.isFinished == true) {
                var v = GameManager.getInstance().getCurrentView();
                v.remove(this.explosionObj);
                this.waitRemove = true;
            }
        }
    };
    MyCharacter.prototype.explode = function () {
        var v = GameManager.getInstance().getCurrentView();
        v.remove(this._obj);
        var ex = new Explosion(this.x, this.y);
        v.add(ex.getParticles());
        this.explosionObj = ex;
    };
    return MyCharacter;
})(CMover);
var CView = (function () {
    function CView() {
        this.objs = new Array();
        this.getScene();
        this.init();
    }
    CView.prototype.init = function () {
        var _this = this;
        this.gm = GameManager.getInstance();
        this.cm = ControlManager.getInstance();
        this._keyEvent = function (e) {
            _this.keyEvent(e);
        };
        this._onMouseDown = function (e) {
            _this.onMouseDown(e);
        };
        this._onMouseMove = function (e) {
            _this.onMouseMove(e);
        };
        this._onMouseUp = function (e) {
            _this.onMouseUp(e);
        };
        this.cm.addEventListener("onKeyPress", this._keyEvent);
        this.cm.addEventListener("onMouseDown", this._onMouseDown);
        this.cm.addEventListener("onMouseMove", this._onMouseMove);
        this.cm.addEventListener("onMouseUp", this._onMouseUp);
    };
    CView.prototype.destructor = function () {
        this.removeAll();
        this.cm.removeEventListener("onKeyPress", this._keyEvent);
        this.cm.removeEventListener("onMouseDown", this._onMouseDown);
        this.cm.removeEventListener("onMouseMove", this._onMouseMove);
        this.cm.removeEventListener("onMouseUp", this._onMouseUp);
    };
    CView.prototype.update = function (nowFrame) {
        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].update(nowFrame);
            if (this.objs[i].waitRemove == true) {
                this.removeMover(this.objs[i], i);
            }
        }
    };
    CView.prototype.add = function (obj) {
        this.scene.add(obj);
    };
    CView.prototype.remove = function (obj) {
        this.scene.remove(obj);
    };
    CView.prototype.addMover = function (chara) {
        this.objs.push(chara);
        this.scene.add(chara.getObject());
    };
    CView.prototype.removeMover = function (chara, index) {
        this.objs.splice(index, 1);
        this.scene.remove(chara.getObject());
        chara.remove();
    };
    CView.prototype.getScene = function () {
        var gm = GameManager.getInstance();
        this.scene = gm.getScene();
    };
    CView.prototype.removeAll = function () {
        for (var i = 0; i < this.objs.length; i++) {
            this.scene.remove(this.objs[i].getObject());
            this.objs[i].remove();
        }
    };
    CView.prototype.keyEvent = function (e) {
    };
    CView.prototype.onMouseDown = function (e) {
    };
    CView.prototype.onMouseMove = function (e) {
    };
    CView.prototype.onMouseUp = function (e) {
    };
    return CView;
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
        document.addEventListener("mousedown", function (e) {
            var et = new events.Event("onMouseDown");
            et.data = e;
            _this.dispatchEvent(et);
        });
        document.addEventListener("mousemove", function (e) {
            var et = new events.Event("onMouseMove");
            et.data = e;
            _this.dispatchEvent(et);
        });
        document.addEventListener("mouseup", function (e) {
            var et = new events.Event("onMouseUp");
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
        this.score = 0;
        this.$viewScore = null;
        this.$viewDebug = null;
        this.startTime = 0;
        this.currentFrame = 0;
        this.fps = 60.0;
        this.frameLength = 60.0;
        this.overlay = ["#view-top", "#view-gameover"];
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
        var _this = this;
        console.log("manager initialize");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, -300, 240);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        this.requestAnimationFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000.0 / 60.0);
            };
        })();
        var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
        this.getTime = function () {
            return (now && now.call(performance)) || (new Date().getTime());
        };
        this.startTime = this.getTime();
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        window.addEventListener("keyup", function (e) {
            var imgData, imgNode;
            if (e.which !== 80)
                return;
            try {
                imgData = _this.renderer.domElement.toDataURL();
                console.log(imgData);
            }
            catch (e) {
                console.log(e);
                console.log("Browser does not support taking screenshot of 3d context");
                return;
            }
        });
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', function () {
        });
        var ctmanager = ControlManager.getInstance();
        this.$viewScore = $("#score");
        this.setScore(0);
        this.$viewScore.show();
        this.$viewDebug = $("#debug");
        this.resize();
        $(window).resize(function () {
            _this.resize();
        });
        $.getJSON("data/scenedata.json", function (data) {
            _this.sceneData = new SceneData(data);
            $("#view-top").show();
            _this.setView(new TopView());
        });
    };
    GameManager.prototype.resize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        for (var i = 0; i < this.overlay.length; i++) {
            $(this.overlay[i]).css({ top: h / 2 - $(this.overlay[i]).height() / 2 });
            $(this.overlay[i]).hide();
        }
    };
    GameManager.prototype.update = function () {
        this.controls.update();
        if (this.currentView && this.isStop == false) {
            this.currentView.update(this.currentFrame);
        }
    };
    GameManager.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    GameManager.prototype.animate = function () {
        var _this = this;
        this.currentFrame = Math.floor((this.getTime() - this.startTime) / (1000.0 / this.fps));
        this.stats.begin();
        this.update();
        this.render();
        this.stats.end();
        requestAnimationFrame(function (e) {
            _this.animate();
        });
    };
    GameManager.prototype.setStartTime = function () {
        this.startTime = this.getTime();
        this.currentFrame = 0;
    };
    GameManager.prototype.getScene = function () {
        return this.scene;
    };
    GameManager.prototype.setView = function (v) {
        if (this.currentView) {
            this.currentView.destructor();
        }
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
    GameManager.prototype.debug = function (str) {
        this.$viewDebug.html(str);
    };
    GameManager.prototype.getCurrentFrame = function () {
        return this.currentFrame;
    };
    GameManager.prototype.getCurrentView = function () {
        return this.currentView;
    };
    GameManager.prototype.setSelfCharacter = function (chara) {
        this.myChara = chara;
    };
    GameManager.prototype.getSelfCharacter = function () {
        return this.myChara;
    };
    GameManager.prototype.getSceneData = function (index) {
        return this.sceneData.getData(index);
    };
    GameManager._instance = null;
    return GameManager;
})();
var gm = GameManager.getInstance();
gm.animate();
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
    function Bullet(vx, vy) {
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
        this.vx = vx;
        this.vy = vy;
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
})(CMover);
var EnemyCharacter = (function (_super) {
    __extends(EnemyCharacter, _super);
    function EnemyCharacter(startframe) {
        _super.call(this);
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.stageWidth = 0;
        this.stageHeight = 0;
        this.point = 150;
        this.startFrame = 0;
        this.currentFrame = 0;
        this.bullets = new Array();
        this.lifeTime = 500;
        this.isShoted = false;
        this.startFrame = startframe;
        this.vy = -6;
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
    EnemyCharacter.prototype.update = function (nowFrame) {
        this.currentFrame = nowFrame - this.startFrame;
        this.frameTest();
        this.x += this.vx;
        this.y += this.vy;
        this.checkAreaTest();
        this._obj.position.set(this.x, this.y, 50);
        for (var i = 0; this.bullets.length < i; i++) {
            this.bullets[i].update(nowFrame);
        }
        if (this.explosionObj != null) {
            this.explosionObj.update(nowFrame);
            if (this.explosionObj.isFinished == true) {
                var v = GameManager.getInstance().getCurrentView();
                v.remove(this.explosionObj);
                this.waitRemove = true;
            }
        }
    };
    EnemyCharacter.prototype.checkAreaTest = function () {
    };
    EnemyCharacter.prototype.frameTest = function () {
        if (this.currentFrame >= 50 && this.currentFrame < 70) {
            this.vy = 0;
        }
        else if (this.currentFrame >= 70 && this.currentFrame < 100) {
            if (this.isShoted == true)
                return;
            this.isShoted = true;
            this.shot();
        }
        else if (this.currentFrame >= 100) {
            this.vy = 6;
        }
        if (this.currentFrame >= this.lifeTime) {
            this.isDead = true;
            this.waitRemove = true;
        }
    };
    EnemyCharacter.prototype.shot = function () {
        if (this.isDead == true)
            return;
        var s = GameManager.getInstance().getSelfCharacter();
        var dist = Math.sqrt(Math.pow((s.x - this.x), 2) + Math.pow((s.y - this.y), 2));
        var b = new Bullet((s.x - this.x) / dist * 3, (s.y - this.y) / dist * 3);
        b.x = this.x;
        b.y = this.y;
        var v = GameManager.getInstance().getCurrentView();
        v.addMover(b);
        this.bullets.push(b);
    };
    EnemyCharacter.prototype.getBullets = function () {
        return this.bullets;
    };
    EnemyCharacter.prototype.explode = function () {
        var v = GameManager.getInstance().getCurrentView();
        v.remove(this._obj);
        var ex = new Explosion(this.x, this.y);
        v.add(ex.getParticles());
        this.explosionObj = ex;
    };
    return EnemyCharacter;
})(CMover);
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
        this.frameCount = 0;
        this.isFinished = false;
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
            this.frameCount++;
            if (this.frameCount > 300) {
                this.status = false;
                this.isFinished = true;
            }
            this._pc.geometry.verticesNeedUpdate = true;
        }
    };
    return Explosion;
})(CMover);
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage() {
        _super.call(this);
    }
    Stage.prototype.init = function () {
        var geometry2 = new THREE.PlaneGeometry(480, 1280, 48, 128);
        var material2 = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
        this._obj = new THREE.Mesh(geometry2, material2);
        this._obj.position.set(0, 0, 0);
        this.vy = -1;
    };
    Stage.prototype.destructor = function () {
    };
    Stage.prototype.update = function () {
        this.y += this.vy;
        if (this.y <= -320) {
            this.y = 0;
        }
        this._obj.position.set(this.x, this.y, 0);
    };
    return Stage;
})(CMover);
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        _super.call(this);
        this.enemies = new Array();
        this.enemyBullets = new Array();
        this.bullets = new Array();
        this.waitingRestart = false;
        this.timerId = 0;
        this.nextActionFrame = 0;
        this.nextActionNum = 0;
        this.isKeyLock = false;
    }
    GameView.prototype.init = function () {
        _super.prototype.init.call(this);
        this.bg = new Stage();
        this.bg.init();
        this.addMover(this.bg);
        this.sceneData = this.gm.getSceneData(0);
        this.nextActionNum = 0;
        this.startGame();
    };
    GameView.prototype.keyEvent = function (e) {
        if (this.isKeyLock == true) {
            return;
        }
        switch (e.data.keyCode) {
            case 32:
                if (this.waitingRestart == true) {
                    this.restart();
                    return;
                }
                var b = new Bullet(0, 12);
                b.x = this.self.x;
                b.y = this.self.y;
                this.addMover(b);
                this.bullets.push(b);
                break;
            case 65:
                this.self.x -= 10;
                break;
            case 87:
                this.self.y += 10;
                break;
            case 68:
                this.self.x += 10;
                break;
            case 83:
                this.self.y -= 10;
                break;
        }
    };
    GameView.prototype.onMouseDown = function (e) {
    };
    GameView.prototype.onMouseMove = function (e) {
        var nowX = e.data.x;
        var nowY = e.data.y;
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.self.x = -240 + 480 * nowX / w;
        this.self.y = 320 - 640 * nowY / h;
    };
    GameView.prototype.onMouseUp = function (e) {
    };
    GameView.prototype.update = function () {
        var currentFrame = this.gm.getCurrentFrame();
        this.gm.debug(currentFrame);
        if (this.nextActionNum < this.sceneData.length && currentFrame == this.sceneData[this.nextActionNum].frame) {
            var enemies = this.sceneData[this.nextActionNum].enemies;
            for (var i = 0; i < enemies.length; i++) {
                var e = new EnemyCharacter(this.gm.getCurrentFrame());
                e.x = enemies[i].x;
                e.y = enemies[i].y;
                this.addMover(e);
                this.enemies.push(e);
            }
            this.nextActionNum++;
        }
        this.hitTest();
        this.checkLiveTest();
        _super.prototype.update.call(this, this.gm.getCurrentFrame());
    };
    GameView.prototype.hitTest = function () {
        for (var i = 0; i < this.bullets.length; i++) {
            for (var j = 0; j < this.enemies.length; j++) {
                if (this.bullets[i].x > this.enemies[j].x - 15 && this.bullets[i].x < this.enemies[j].x + 15 && this.bullets[i].y > this.enemies[j].y - 15 && this.bullets[i].y < this.enemies[j].y + 15) {
                    if (!this.enemies[j].isDead) {
                        this.bullets[i].isDead = true;
                        this.bullets[i].waitRemove = true;
                        this.enemies[j].isDead = true;
                        this.enemies[j].explode();
                        this.gm.addScore(this.enemies[j].point);
                    }
                }
            }
        }
        for (var j = 0; j < this.enemies.length; j++) {
            var bulletArray = this.enemies[j].getBullets();
            for (var k = 0; k < bulletArray.length; k++) {
                var b = bulletArray[k];
                if (this.self.x > b.x - 15 && this.self.x < b.x + 15 && this.self.y > b.y - 15 && this.self.y < b.y + 15) {
                    if (!this.self.isDead) {
                        this.self.isDead = true;
                        this.self.explode();
                    }
                }
            }
        }
        for (var j = 0; j < this.enemies.length; j++) {
            if (this.self.x > this.enemies[j].x - 15 && this.self.x < this.enemies[j].x + 15 && this.self.y > this.enemies[j].y - 15 && this.self.y < this.enemies[j].y + 15) {
                if (!this.self.isDead) {
                    this.self.isDead = true;
                    this.self.explode();
                }
            }
        }
    };
    GameView.prototype.checkLiveTest = function () {
        var _this = this;
        if (this.self.isDead == true && this.waitingRestart == false) {
            this.waitingRestart = true;
            this.isKeyLock = true;
            setTimeout(function () {
                _this.setGameOver();
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
            if (this.enemies[n].waitRemove == true) {
                this.enemies.splice(n, 1);
            }
            else {
                n++;
            }
        }
    };
    GameView.prototype.setGameOver = function () {
        $("#overlay").show();
        $("#view-gameover").show();
        this.isKeyLock = false;
    };
    GameView.prototype.startGame = function () {
        $("#overlay").hide();
        this.bg = new Stage();
        this.bg.init();
        this.addMover(this.bg);
        this.self = new MyCharacter();
        this.self.y = -150;
        this.addMover(this.self);
        this.gm.setSelfCharacter(this.self);
        this.gm.setStartTime();
    };
    GameView.prototype.restart = function () {
        this.waitingRestart = false;
        clearTimeout(this.timerId);
        this.removeAll();
        this.bullets.length = 0;
        this.enemies.length = 0;
        this.gm.setScore(0);
        this.startGame();
        this.nextActionNum = 0;
    };
    return GameView;
})(CView);
var SceneData = (function () {
    function SceneData(data) {
        this._data = data;
    }
    SceneData.prototype.getData = function (index) {
        return this._data[index];
    };
    return SceneData;
})();
var Shooter = (function () {
    function Shooter() {
        this.bullets = new Array();
    }
    Shooter.prototype.update = function () {
    };
    Shooter.prototype.shot = function () {
    };
    return Shooter;
})();
var TopView = (function (_super) {
    __extends(TopView, _super);
    function TopView() {
        _super.call(this);
    }
    TopView.prototype.init = function () {
        _super.prototype.init.call(this);
        this.gm = GameManager.getInstance();
        $("#view-top").show();
    };
    TopView.prototype.keyEvent = function (e) {
        switch (e.data.keyCode) {
            case 32:
                this.moveNextScene();
                $("#view-top").hide();
                break;
        }
    };
    TopView.prototype.moveNextScene = function () {
        $("#overlay").hide();
        this.gm.setView(new GameView());
    };
    return TopView;
})(CView);
