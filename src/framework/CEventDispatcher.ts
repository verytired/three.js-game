module events {
    export class EventDispatcher {
        listeners: any = {};
        dispatchEvent(event: any): void {
            var e: Event;
            var type: string;
            if (event instanceof Event) {
                type = event.type;
                e = event;
            } else {
                type = event;
                e = new Event(type);
            }

            if (this.listeners[type] != null) {
                e.currentTarget = this;
                for (var i: number = 0; i < this.listeners[type].length; i++) {
                    var listener: EventListener = this.listeners[type][i];
                    try {
                        listener.handler(e);
                    } catch (error) {
                        if (window.console) {
                            console.error(error.stack);
                        }
                    }
                }
            }
        }

        addEventListener(type: string, callback: Function, priolity: number = 0): void {
            if (this.listeners[type] == null) {
                this.listeners[type] = [];
            }


            this.listeners[type].push(new EventListener(type, callback, priolity));
            this.listeners[type].sort(function(listener1: EventListener, listener2: EventListener) {
                return listener2.priolity - listener1.priolity;
            });
        }

        removeEventListener(type: string, callback: Function): void {
            if (this.hasEventListener(type, callback)) {
                for (var i: number = 0; i < this.listeners[type].length; i++) {
                    var listener: EventListener = this.listeners[type][i];
                    if (listener.equalCurrentListener(type, callback)) {
                        listener.handler = null;
                        this.listeners[type].splice(i, 1);
                        return;
                    }
                }
            }
        }

        clearEventListener(): void {
            this.listeners = {};
        }

        containEventListener(type: string): boolean {
            if (this.listeners[type] == null) return false;
            return this.listeners[type].length > 0;
        }

        hasEventListener(type: string, callback: Function): boolean {
            if (this.listeners[type] == null) return false;
            for (var i: number = 0; i < this.listeners[type].length; i++) {
                var listener: EventListener = this.listeners[type][i];
                if (listener.equalCurrentListener(type, callback)) {
                    return true;
                }
            }
            return false;
        }
    }

    class EventListener {
        constructor(public type: string = null, public handler: Function = null, public priolity: number = 0) {
        }
        equalCurrentListener(type: string, handler: Function): boolean {
            if (this.type == type && this.handler == handler) {
                return true;
            }
            return false;
        }
    }

    export class Event {
        currentTarget: any;
        static COMPLETE: string = "complete";
        static CHANGE_PROPERTY: string = "changeProperty";
        public data;
        constructor(public type: string = null, public value: any = null) {

        }
    }
}
