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
        this.waitRemove = false;
        this._obj = new THREE.Object3D();
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
        this._obj.position.set(x, y, z);
    };
    return CMover;
})(events.EventDispatcher);
var Mover = (function (_super) {
    __extends(Mover, _super);
    function Mover() {
        _super.call(this);
        this.isDead = false;
        this.hitArea = new Array();
        this.hitAreaPos = new Array();
    }
    Mover.prototype.explode = function () {
    };
    Mover.prototype.hitTest = function (hitAreaArray) {
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
    };
    return Mover;
})(CMover);
var MyShip = (function (_super) {
    __extends(MyShip, _super);
    function MyShip() {
        _super.call(this);
        this.vy = -2;
        var geometry = new THREE.BoxGeometry(20, 20, 20);
        var materials = [
            new THREE.MeshLambertMaterial({
                color: 0xff0000,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
        this._obj.castShadow = true;
        this.hitArea.push(new HitArea(20, 20, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
    }
    MyShip.prototype.update = function (nowFrame) {
        this.setPosition(this.x, this.y, this.z);
    };
    MyShip.prototype.explode = function () {
        this.waitRemove = true;
        var v = GameApp.getInstance().getCurrentView();
        var ex = new Explosion(this.x, this.y, 0xFF0000);
        v.addMover(ex);
    };
    MyShip.prototype.setPosition = function (x, y, z) {
        for (var i = 0; i < this.hitArea.length; i++) {
            this.hitArea[i].update(x + this.hitAreaPos[i].x, y + this.hitAreaPos[i].y);
        }
        _super.prototype.setPosition.call(this, x, y, z);
    };
    return MyShip;
})(Mover);
var CView = (function () {
    function CView() {
        this.objs = new Array();
        this.init();
    }
    CView.prototype.init = function () {
        var _this = this;
        this.app = GameApp.getInstance();
        this.scene = this.app.getScene();
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
    CView.prototype.removeAll = function () {
        for (var i = 0; i < this.objs.length; i++) {
            this.scene.remove(this.objs[i].getObject());
            this.objs[i].remove();
        }
    };
    CView.prototype.resize = function () {
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
        var type = GameApp.getInstance().ua;
        if (type == "pc") {
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
        }
        else {
            document.addEventListener("touchstart", function (e) {
                var et = new events.Event("onMouseDown");
                et.data = e;
                _this.dispatchEvent(et);
            });
            document.addEventListener("touchmove", function (e) {
                var et = new events.Event("onMouseMove");
                et.data = e;
                _this.dispatchEvent(et);
            });
            document.addEventListener("touchend", function (e) {
                var et = new events.Event("onMouseUp");
                et.data = e;
                _this.dispatchEvent(et);
            });
        }
    };
    ControlManager._instance = null;
    return ControlManager;
})(events.EventDispatcher);
var GameApp = (function () {
    function GameApp() {
        this.stageWidth = 480;
        this.stageHeight = 640;
        this.isStop = false;
        this.startTime = 0;
        this.currentFrame = 0;
        this.fps = 60.0;
        this.frameLength = 60.0;
        this.useControl = false;
        if (GameApp._instance) {
            throw new Error("must use the getInstance.");
        }
        GameApp._instance = this;
        this.initialize();
    }
    GameApp.getInstance = function () {
        if (GameApp._instance === null) {
            GameApp._instance = new GameApp();
        }
        return GameApp._instance;
    };
    GameApp.prototype.initialize = function () {
        var _this = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, -300, 240);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
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
        this.ua = "pc";
        var ua = navigator.userAgent;
        if (ua.indexOf('iPhone') > 0) {
            this.ua = "ios";
        }
        else if (ua.indexOf('Android') > 0) {
            this.ua = "android";
        }
        if (this.useControl == true) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.addEventListener('change', function () {
            });
        }
        var ctmanager = ControlManager.getInstance();
        this.resize();
        $(window).resize(function () {
            _this.resize();
            if (_this.currentView != undefined && _this.currentView != null) {
                _this.currentView.resize();
            }
        });
    };
    GameApp.prototype.resize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
    };
    GameApp.prototype.update = function () {
        if (this.useControl == true)
            this.controls.update();
        if (this.currentView && this.isStop == false) {
            this.currentView.update(this.currentFrame);
        }
    };
    GameApp.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    GameApp.prototype.animate = function () {
        var _this = this;
        this.stats.begin();
        this.update();
        this.render();
        this.stats.end();
        requestAnimationFrame(function (e) {
            _this.animate();
        });
        this.currentFrame++;
    };
    GameApp.prototype.setStartTime = function () {
        this.startTime = this.getTime();
        this.currentFrame = 0;
    };
    GameApp.prototype.setView = function (v) {
        if (this.currentView) {
            this.currentView.destructor();
        }
        this.currentView = v;
        this.currentView.resize();
    };
    GameApp.prototype.getStageSize = function () {
        return { width: this.stageWidth, height: this.stageHeight };
    };
    GameApp.prototype.getCurrentFrame = function () {
        return this.currentFrame;
    };
    GameApp.prototype.getCurrentView = function () {
        return this.currentView;
    };
    GameApp.prototype.getScene = function () {
        return this.scene;
    };
    GameApp.prototype.getRenderer = function () {
        return this.renderer;
    };
    GameApp.prototype.getCamera = function () {
        return this.camera;
    };
    GameApp.prototype.start = function () {
        this.animate();
    };
    GameApp._instance = null;
    return GameApp;
})();
var GameManager = (function () {
    function GameManager() {
        this.isStop = false;
        this.score = 0;
        this.zPosition = 50;
        this.$viewScore = null;
        this.$viewDebug = null;
        this.overlay = ["#view-top", "#view-gameover", "#view-stageclear"];
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
        var _this = this;
        this.$viewScore = $("#score");
        this.setScore(0);
        this.$viewScore.show();
        this.$viewDebug = $("#debug");
        var app = GameApp.getInstance();
        var scene = app.getScene();
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, -300, 300);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        scene.fog = new THREE.Fog(0x000000, 480, 640);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        scene.add(axis);
        $.getJSON("data/scenedata.json", function (data) {
            _this.sceneData = new SceneData(data);
            $("#view-top").show();
            app.setView(new TopView());
            app.start();
        });
        this.resize();
    };
    GameManager.prototype.resize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        for (var i = 0; i < this.overlay.length; i++) {
            $(this.overlay[i]).css({ top: h / 2 - $(this.overlay[i]).height() / 2 });
            $(this.overlay[i]).hide();
        }
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
GameManager.getInstance().initialize();
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
        this.stageWidth = 0;
        this.stageHeight = 0;
        var s = GameApp.getInstance().getStageSize();
        this.stageWidth = s.width;
        this.stageHeight = s.height;
        this.vx = vx;
        this.vy = vy;
        var texture = new THREE.Texture(this.generateSprite());
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var material = new THREE.SpriteMaterial({
            map: texture,
            blending: THREE.AdditiveBlending
        });
        var sp = new THREE.Sprite(material);
        sp.scale.x = sp.scale.y = 64;
        this._obj.add(sp);
        this._obj.castShadow = true;
        this.hitArea.push(new HitArea(10, 10, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
    }
    Bullet.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.setPosition(this.x, this.y, this.z);
        this.checkAreaTest();
    };
    Bullet.prototype.checkAreaTest = function () {
        if (this.x > this.stageWidth / 2 || this.x < -this.stageWidth / 2 || this.y > this.stageHeight / 2 || this.y < -this.stageHeight / 2) {
            this.isDead = true;
            this.waitRemove = true;
        }
    };
    Bullet.prototype.setPosition = function (x, y, z) {
        for (var i = 0; i < this.hitArea.length; i++) {
            this.hitArea[i].update(x + this.hitAreaPos[i].x, y + this.hitAreaPos[i].y);
        }
        _super.prototype.setPosition.call(this, x, y, z);
    };
    Bullet.prototype.generateSprite = function () {
        var canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        var context = canvas.getContext("2d");
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(0,255,255,1)");
        gradient.addColorStop(0.4, "rgba(0,0,64,1)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    };
    return Bullet;
})(Mover);
var BulletEnemy = (function (_super) {
    __extends(BulletEnemy, _super);
    function BulletEnemy(vx, vy) {
        _super.call(this, vx, vy);
    }
    BulletEnemy.prototype.generateSprite = function () {
        var canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        var context = canvas.getContext("2d");
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(255,0,255,1)");
        gradient.addColorStop(0.4, "rgba(64,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    };
    return BulletEnemy;
})(Bullet);
var Shooter = (function () {
    function Shooter() {
        this.bullets = new Array();
    }
    Shooter.prototype.update = function (frame) {
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(frame);
        }
    };
    Shooter.prototype.shot = function (x, y, vx, vy) {
        var b = new BulletEnemy(vx, vy);
        var v = GameApp.getInstance().getCurrentView();
        var z = GameManager.getInstance().zPosition;
        b.setPosition(x, y, z);
        v.addMover(b);
        this.bullets.push(b);
    };
    Shooter.prototype.getBullets = function () {
        return this.bullets;
    };
    return Shooter;
})();
var SingleShooter = (function (_super) {
    __extends(SingleShooter, _super);
    function SingleShooter() {
        _super.call(this);
    }
    return SingleShooter;
})(Shooter);
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(startframe) {
        _super.call(this);
        this.point = 150;
        this.life = 1;
        this.lifeTime = 500;
        this.startFrame = 0;
        this.currentFrame = 0;
        this.baseColor = 0xFFFFFF;
        this.receiveDamage = true;
        this.startFrame = startframe;
        this.initialize();
    }
    Enemy.prototype.initialize = function () {
        this.vy = -6;
        var materials = [
            new THREE.MeshLambertMaterial({
                color: this.baseColor,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.OctahedronGeometry(20, 1), materials);
        this._obj.castShadow = true;
        this.shooter = new SingleShooter();
        this.hitArea.push(new HitArea(20, 20, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
    };
    Enemy.prototype.update = function (nowFrame) {
        var frame = nowFrame - this.startFrame;
        if (frame <= this.currentFrame)
            return;
        this.currentFrame = frame;
        this.doAction();
        this.x += this.vx;
        this.y += this.vy;
        this.setPosition(this.x, this.y, this.z);
    };
    Enemy.prototype.doAction = function () {
        if (this.currentFrame == 50) {
            this.vy = 0;
        }
        else if (this.currentFrame == 70) {
            this.shot();
        }
        else if (this.currentFrame == 100) {
            this.vy = 6;
        }
        if (this.lifeTime == -1)
            return;
        if (this.currentFrame >= this.lifeTime) {
            this.isDead = true;
            this.waitRemove = true;
        }
    };
    Enemy.prototype.shot = function () {
        if (this.isDead == true)
            return;
        var s = GameManager.getInstance().getSelfCharacter();
        var dist = Math.sqrt(Math.pow((s.x - this.x), 2) + Math.pow((s.y - this.y), 2));
        this.shooter.shot(this.x, this.y, (s.x - this.x) / dist * 3, (s.y - this.y) / dist * 3);
    };
    Enemy.prototype.getBullets = function () {
        return this.shooter.getBullets();
    };
    Enemy.prototype.explode = function () {
        this.waitRemove = true;
        var v = GameApp.getInstance().getCurrentView();
        var ex = new Explosion(this.x, this.y, this.baseColor);
        v.addMover(ex);
    };
    Enemy.prototype.hit = function () {
        var _this = this;
        if (this.receiveDamage == false)
            return;
        var msh = this._obj.children[0];
        var ma = msh.material;
        ma.color.setHex(0xFF0000);
        setTimeout(function () {
            ma.color.setHex(_this.baseColor);
        }, 200);
        this.life--;
        if (this.life <= 0) {
            this.isDead = true;
            this.explode();
        }
    };
    Enemy.prototype.setPosition = function (x, y, z) {
        for (var i = 0; i < this.hitArea.length; i++) {
            this.hitArea[i].update(x + this.hitAreaPos[i].x, y + this.hitAreaPos[i].y);
        }
        _super.prototype.setPosition.call(this, x, y, z);
    };
    Enemy.prototype.getPoint = function () {
        return this.point;
    };
    Enemy.prototype.setLifeTime = function (t) {
        this.lifeTime = t;
    };
    Enemy.prototype.setLife = function (l) {
        this.life = l;
    };
    Enemy.prototype.setShooter = function (s) {
        this.shooter = s;
    };
    Enemy.prototype.setBaseColor = function (c) {
        this.baseColor = c;
    };
    return Enemy;
})(Mover);
var EnemyBoss = (function (_super) {
    __extends(EnemyBoss, _super);
    function EnemyBoss(startframe) {
        _super.call(this, startframe);
        this.moveType = 0;
        this.farmecount = 0;
        this.isLoop = false;
    }
    EnemyBoss.prototype.initialize = function () {
        this.vy = -2;
        this.vx = 0;
        this.baseColor = 0x00ff00;
        var materials = [
            new THREE.MeshLambertMaterial({
                color: this.baseColor,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.IcosahedronGeometry(120, 3), materials);
        this._obj.castShadow = true;
        this.setShooter(new SingleShooter());
        this.setLife(600);
        this.setLifeTime(-1);
        this.setBaseColor(0x00FF00);
        this.hitArea.push(new HitArea(120, 120, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
        this.receiveDamage = false;
    };
    EnemyBoss.prototype.doAction = function () {
        var duration = 30;
        var vx = 3;
        if (this.life <= 300) {
            duration = 18;
            vx = 5;
        }
        if (this.isLoop) {
            this.farmecount++;
            console.log();
            if (this.farmecount % duration == 0) {
                this.shot();
            }
            if (this.x > 320) {
                this.x = 320;
                this.vx = -vx;
            }
            else if (this.x < -320) {
                this.x = -320;
                this.vx = vx;
            }
            return;
        }
        if (this.currentFrame == 240) {
            this.vy = 0;
            this.vx = 2;
            this.isLoop = true;
            this.receiveDamage = true;
        }
    };
    return EnemyBoss;
})(Enemy);
var EnemyMid = (function (_super) {
    __extends(EnemyMid, _super);
    function EnemyMid(startframe) {
        _super.call(this, startframe);
    }
    EnemyMid.prototype.initialize = function () {
        this.vy = -4;
        this.baseColor = 0x00ff00;
        var materials = [
            new THREE.MeshLambertMaterial({
                color: this.baseColor,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.IcosahedronGeometry(40, 1), materials);
        this._obj.castShadow = true;
        this.shooter = new ShooterNway();
        this.setLife(30);
        this.setLifeTime(540);
        this.setBaseColor(0x00FF00);
        this.hitArea.push(new HitArea(40, 40, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
    };
    EnemyMid.prototype.shot = function () {
        if (this.isDead == true)
            return;
        this.shooter.shot(this.x, this.y, 8, 15, 3);
    };
    EnemyMid.prototype.doAction = function () {
        if (this.currentFrame == 70) {
            this.vy = 0;
        }
        else if (this.currentFrame == 120) {
            this.shot();
        }
        else if (this.currentFrame == 140) {
            this.shot();
        }
        else if (this.currentFrame == 160) {
            this.shot();
        }
        else if (this.currentFrame == 180) {
            this.shot();
        }
        else if (this.currentFrame == 200) {
            this.vy = 6;
        }
        if (this.currentFrame >= this.lifeTime) {
            this.isDead = true;
            this.waitRemove = true;
        }
    };
    return EnemyMid;
})(Enemy);
var EnemySmall = (function (_super) {
    __extends(EnemySmall, _super);
    function EnemySmall(startframe) {
        _super.call(this, startframe);
    }
    EnemySmall.prototype.initialize = function () {
        this.vy = -8;
        var materials = [
            new THREE.MeshLambertMaterial({
                color: this.baseColor,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true
            })
        ];
        this._obj = THREE.SceneUtils.createMultiMaterialObject(new THREE.CylinderGeometry(20, 40, 40, 16), materials);
        this._obj.castShadow = true;
        this._obj.rotation.x = 90;
        this.hitArea.push(new HitArea(20, 20, this.x, this.y));
        this.hitAreaPos.push(new THREE.Vector2(0, 0));
        this.setShooter(new SingleShooter());
    };
    EnemySmall.prototype.doAction = function () {
        if (this.currentFrame >= this.lifeTime) {
            this.isDead = true;
            this.waitRemove = true;
        }
    };
    return EnemySmall;
})(Enemy);
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y, color) {
        _super.call(this);
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
        var color = arguments[2];
        if (color == undefined || color == null) {
            color = 0xFFFFFF;
        }
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
            color: color,
            size: 5,
            transparent: true
        });
        this._obj.add(new THREE.PointCloud(particles, materialParticle));
        this.status = true;
        this.xDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.yDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
        this.zDir = (Math.random() * this.movementSpeed) - (this.movementSpeed / 2);
    }
    Explosion.prototype.init = function () {
    };
    Explosion.prototype.update = function () {
        if (this.status == true) {
            var m = this._obj.children[0];
            var pCount = this.totalObjects;
            while (pCount--) {
                var particle = m.geometry.vertices[pCount];
                particle.y += this.dirs[pCount].y;
                particle.x += this.dirs[pCount].x;
                particle.z += this.dirs[pCount].z;
            }
            this.frameCount++;
            if (this.frameCount > 300) {
                this.status = false;
                this.waitRemove = true;
            }
            m.geometry.verticesNeedUpdate = true;
        }
    };
    return Explosion;
})(Mover);
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage() {
        _super.call(this);
    }
    Stage.prototype.init = function () {
        var geometry2 = new THREE.PlaneGeometry(480, 1280, 48, 128);
        var material2 = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
        this._obj.add(new THREE.Mesh(geometry2, material2));
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
})(Mover);
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        _super.call(this);
        this.enemies = new Array();
        this.enemyBullets = new Array();
        this.bullets = new Array();
        this.isKeyLock = false;
        this.waitingRestart = false;
        this.timerId = 0;
        this.nextActionFrame = 0;
        this.nextActionNum = 0;
        this.isInBossBattle = false;
    }
    GameView.prototype.init = function () {
        _super.prototype.init.call(this);
        this.bg = new Stage();
        this.bg.init();
        this.addMover(this.bg);
        this.nextActionNum = 0;
        this.gm = GameManager.getInstance();
        this.sceneData = this.gm.getSceneData(0);
        this.zPosition = this.gm.zPosition;
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
                b.setPosition(this.self.x, this.self.y, this.zPosition);
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
        if (this.app.ua != "pc") {
            nowX = e.data.touches[0].clientX;
            nowY = e.data.touches[0].clientY;
        }
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.self.setPosition(-240 + 480 * nowX / w, 320 - 640 * nowY / h, this.zPosition);
    };
    GameView.prototype.onMouseUp = function (e) {
        if (this.isKeyLock == true) {
            return;
        }
        if (this.waitingRestart == true) {
            this.restart();
            return;
        }
    };
    GameView.prototype.update = function () {
        var currentFrame = this.app.getCurrentFrame();
        this.gm.debug(currentFrame);
        if (this.nextActionNum < this.sceneData.length && currentFrame == this.sceneData[this.nextActionNum].frame) {
            var enemies = this.sceneData[this.nextActionNum].enemies;
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].type == 1) {
                    var e = new Enemy(this.app.getCurrentFrame());
                    e.setPosition(enemies[i].x, enemies[i].y, this.zPosition);
                    this.addMover(e);
                    this.enemies.push(e);
                }
                else if (enemies[i].type == 2) {
                    var e = new EnemyMid(this.app.getCurrentFrame());
                    e.setPosition(enemies[i].x, enemies[i].y, this.zPosition);
                    this.addMover(e);
                    this.enemies.push(e);
                }
                else if (enemies[i].type == 3) {
                    var b = new EnemySmall(this.app.getCurrentFrame());
                    b.setPosition(enemies[i].x, enemies[i].y, this.zPosition);
                    this.addMover(b);
                    this.enemies.push(b);
                }
                else if (enemies[i].type == 4) {
                    var boss = new EnemyBoss(this.app.getCurrentFrame());
                    boss.setPosition(enemies[i].x, enemies[i].y, this.zPosition);
                    this.addMover(boss);
                    this.enemies.push(boss);
                    this.isInBossBattle = true;
                    this.boss = boss;
                }
            }
            this.nextActionNum++;
        }
        this.hitTest();
        this.checkLiveTest();
        _super.prototype.update.call(this, this.app.getCurrentFrame());
    };
    GameView.prototype.hitTest = function () {
        var _this = this;
        if (this.boss != null && this.boss.isDead) {
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].isDead = true;
                this.bullets[i].waitRemove = true;
            }
            this.isInBossBattle = false;
            this.boss = null;
            this.waitingRestart = true;
            this.isKeyLock = true;
            setTimeout(function () {
                _this.setClear();
            }, 3000);
            return;
        }
        for (var i = 0; i < this.bullets.length; i++) {
            for (var j = 0; j < this.enemies.length; j++) {
                if (this.enemies[j].hitTest(this.bullets[i].hitArea) == true) {
                    if (!this.enemies[j].isDead) {
                        this.bullets[i].isDead = true;
                        this.bullets[i].waitRemove = true;
                        this.enemies[j].hit();
                        if (this.enemies[j].isDead == true) {
                            this.gm.addScore(this.enemies[j].getPoint());
                        }
                    }
                }
            }
        }
        for (var j = 0; j < this.enemies.length; j++) {
            var bulletArray = this.enemies[j].getBullets();
            for (var k = 0; k < bulletArray.length; k++) {
                var b = bulletArray[k];
                if (this.self.hitTest(b.hitArea) == true) {
                    if (!this.self.isDead) {
                        this.self.isDead = true;
                        this.self.explode();
                    }
                }
            }
        }
        for (var j = 0; j < this.enemies.length; j++) {
            if (this.self.hitTest(this.enemies[j].hitArea) == true) {
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
    GameView.prototype.setClear = function () {
        $("#overlay").show();
        $("#view-stageclear").show();
        this.isKeyLock = false;
    };
    GameView.prototype.startGame = function () {
        $("#view-gameover").hide();
        $("#view-stageclear").hide();
        $("#overlay").hide();
        this.bg = new Stage();
        this.bg.init();
        this.addMover(this.bg);
        this.self = new MyShip();
        this.self.setPosition(0, 300, 0);
        this.addMover(this.self);
        this.gm.setSelfCharacter(this.self);
        this.app.setStartTime();
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
    GameView.prototype.resize = function () {
        this.gm.resize();
    };
    return GameView;
})(CView);
var HitArea = (function () {
    function HitArea(w, h, x, y) {
        this.positions = new Array();
        this.center = new THREE.Vector2(x, y);
        this.width = w;
        this.height = h;
    }
    HitArea.prototype.update = function (x, y) {
        this.center.set(x, y);
        this.positions[0] = new THREE.Vector2(this.center.x - this.width / 2, this.center.y - this.height / 2);
        this.positions[1] = new THREE.Vector2(this.center.x + this.width / 2, this.center.y - this.height / 2);
        this.positions[2] = new THREE.Vector2(this.center.x - this.width / 2, this.center.y + this.height / 2);
        this.positions[3] = new THREE.Vector2(this.center.x + this.width / 2, this.center.y + this.height / 2);
    };
    HitArea.prototype.hitTest = function (area) {
        var pos = area.getPositions();
        for (var i = 0; i < pos.length; i++) {
            var p = pos[i];
            if (p.x > (this.center.x - this.width / 2) && p.x < (this.center.x + this.width / 2) && p.y > (this.center.y - this.height / 2) && p.y < (this.center.y + this.height / 2)) {
                return true;
            }
        }
        return false;
    };
    HitArea.prototype.getPositions = function () {
        return this.positions;
    };
    return HitArea;
})();
var SceneData = (function () {
    function SceneData(data) {
        this._data = data;
    }
    SceneData.prototype.getData = function (index) {
        return this._data[index];
    };
    return SceneData;
})();
var ShooterNway = (function (_super) {
    __extends(ShooterNway, _super);
    function ShooterNway() {
        _super.call(this);
    }
    ShooterNway.prototype.shot = function (x, y, nway, durationRad, speed) {
        if (speed === void 0) { speed = 5; }
        if (nway <= 1)
            return;
        var baseForward = 270;
        var totalRad = durationRad * (nway - 1);
        var startRad = baseForward - totalRad / 2;
        var v = GameApp.getInstance().getCurrentView();
        var z = GameManager.getInstance().zPosition;
        for (var i = 0; i < nway; i++) {
            var vx = Math.cos((startRad + durationRad * i) * (Math.PI / 180)) * speed;
            var vy = Math.sin((startRad + durationRad * i) * (Math.PI / 180)) * speed;
            var b = new BulletEnemy(vx, vy);
            b.setPosition(x, y, z);
            v.addMover(b);
            this.getBullets().push(b);
        }
    };
    return ShooterNway;
})(Shooter);
var TopView = (function (_super) {
    __extends(TopView, _super);
    function TopView() {
        _super.call(this);
    }
    TopView.prototype.init = function () {
        _super.prototype.init.call(this);
        $("#view-top").show();
        this.resize();
    };
    TopView.prototype.keyEvent = function (e) {
        switch (e.data.keyCode) {
            case 32:
                this.moveNextScene();
                $("#view-top").hide();
                break;
        }
    };
    TopView.prototype.onMouseDown = function (e) {
        this.moveNextScene();
        $("#view-top").hide();
    };
    TopView.prototype.moveNextScene = function () {
        $("#overlay").hide();
        this.app.setView(new GameView());
    };
    return TopView;
})(CView);
