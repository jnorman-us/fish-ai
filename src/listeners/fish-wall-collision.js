import Fish from '../entities/fish.js';
import FishTank from '../entities/fish-tank.js';

export default function fishWallCollisionListener(e, simulation) {
	for(const pair of e.pairs) {
		const a = pair.bodyA.entity_ref;
		const b = pair.bodyB.entity_ref;

		if(a != null && b != null) {
			var fish = null;
			var wall = null;

			if(a instanceof Fish && b instanceof FishTank) {
				fish = a;
				wall = b;
			}
			else if(b instanceof Fish && a instanceof FishTank) {
				fish = b;
				wall = a;
			}
			else return;

			fish.crash();
		}
	}
}
