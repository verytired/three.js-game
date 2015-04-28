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
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this._obj = new THREE.Mesh(geometry, material);
        this._obj.position.set(0, 60, 50);
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
    GameManager.prototype.getStageSize = function () {
        return { width: this.stageWidth, height: this.stageHeight };
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
        this.vy = 2;
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
        var _this = this;
        var pGeometry = new THREE.PlaneBufferGeometry(480, 640);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        this.add(plane);
        var c = new MyCharacter();
        c.y = -150;
        this.addCharacter(c);
        var cm = ControlManager.getInstance();
        cm.addEventListener("onKeyPress", function (e) {
            switch (e.data.keyCode) {
                case 32:
                    var b = new Bullet();
                    b.x = c.x;
                    b.y = c.y;
                    _this.addCharacter(b);
                    break;
                case 65:
                    console.log("left");
                    c.x -= 10;
                    break;
                case 87:
                    console.log("up");
                    c.y += 10;
                    break;
                case 68:
                    console.log("right");
                    c.x += 10;
                    break;
                case 83:
                    console.log("down");
                    c.y -= 10;
                    break;
            }
        });
        var that = this;
        var func = function () {
            setTimeout(function () {
                console.log("test");
                var e = new EnemyCharacter();
                e.y = 320;
                e.x = -320 + Math.random() * 640;
                that.addCharacter(e);
                func();
            }, 1000);
        };
        func();
    };
    return TestGameView;
})(View);
