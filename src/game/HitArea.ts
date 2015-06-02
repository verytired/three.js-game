/**
 * Created by yutaka.sano on 2015/06/02.
 */

class HitArea {

	public position:THREE.Vector2[] = new Array();
	public center:THREE.Vector2;
	private width;
	private height;

	constructor(x, y, w, h) {
		this.center = new THREE.Vector2(x, y);
		this.width = w;
		this.height = h;
		this.position.push(new THREE.Vector2(x - w / 2, y - h / 2));
		this.position.push(new THREE.Vector2(x + w / 2, y - h / 2));
		this.position.push(new THREE.Vector2(x - w / 2, y + h / 2));
		this.position.push(new THREE.Vector2(x + w / 2, y + h / 2));
	}

	public hitTest(area:HitArea) {
		for (var i = 0; i < area.position.length; i++) {
			var p:THREE.Vector2 = area.position[i];
			if (p.x > this.center.x - this.width / 2 && p.x < this.center.x + this.width / 2 && p.y > this.center.y - this.height / 2 && p.y < this.center.y + this.height / 2) {
				return true
			}
		}
		return false
	}

}