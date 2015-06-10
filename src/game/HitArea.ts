/**
 * Created by yutaka.sano on 2015/06/02.
 */

class HitArea {

	public center:THREE.Vector2;//中心座標
	private width;//横幅
	private height;//縦幅
	private positions:THREE.Vector2[] = new Array();

	constructor(w, h, x, y) {
		this.center = new THREE.Vector2(x, y);
		this.width = w;
		this.height = h;
	}

	public update(x, y) {
		this.center.set(x, y);
		this.positions[0] = new THREE.Vector2(this.center.x - this.width / 2, this.center.y - this.height / 2);
		this.positions[1] = new THREE.Vector2(this.center.x + this.width / 2, this.center.y - this.height / 2);
		this.positions[2] = new THREE.Vector2(this.center.x - this.width / 2, this.center.y + this.height / 2);
		this.positions[3] = new THREE.Vector2(this.center.x + this.width / 2, this.center.y + this.height / 2);
	}

	public hitTest(area:HitArea) {
		var pos = area.getPositions();
		for (var i = 0; i < pos.length; i++) {
			var p:THREE.Vector2 = pos[i];
			if (p.x > (this.center.x - this.width / 2) && p.x < (this.center.x + this.width / 2) && p.y > (this.center.y - this.height / 2) && p.y < (this.center.y + this.height / 2)) {
				return true;
			}
		}
		return false;
	}

	public getPositions() {
		return this.positions;
	}

}