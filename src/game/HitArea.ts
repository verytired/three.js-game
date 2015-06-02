/**
 * Created by yutaka.sano on 2015/06/02.
 */

class HitArea {

	public center:THREE.Vector2;
	private width;
	private height;

	constructor(w, h, x, y) {
		this.center = new THREE.Vector2(x, y);
		this.width = w;
		this.height = h;
	}

	public update(x, y) {
		this.center.set(x, y);
	}

	public hitTest(area:HitArea) {
		var pos = area.getPositions();

		for (var i = 0; i < pos.length; i++) {
			var p:THREE.Vector2 = pos[i];
			if (p.x > (this.center.x - this.width / 2) && p.x < (this.center.x + this.width / 2) && p.y > (this.center.y - this.height / 2) && p.y < (this.center.y + this.height / 2)) {
				return true;
			}
		}
		return false
	}

	public getPositions() {
		var positions:THREE.Vector2[] = new Array();
		positions.push(new THREE.Vector2(this.center.x - this.width / 2, this.center.y - this.height / 2));
		positions.push(new THREE.Vector2(this.center.x + this.width / 2, this.center.y - this.height / 2));
		positions.push(new THREE.Vector2(this.center.x - this.width / 2, this.center.y + this.height / 2));
		positions.push(new THREE.Vector2(this.center.x + this.width / 2, this.center.y + this.height / 2));
		return positions;
	}

}