import Fish from '../entities/fish.js';
import Food from '../entities/food.js';

import FishTank from '../entities/fish-tank.js';

export default function fishFoodCollisionListener(e, simulation) {
	for(const pair of e.pairs) {
		const a = pair.bodyA.entity_ref;
		const b = pair.bodyB.entity_ref;

		if(!(b instanceof FishTank) && !(a instanceof FishTank))
			console.log(a, b);

		if(a != null && b != null) {
			var fish = null;
			var food = null;

			if(a instanceof Fish && b instanceof Food) {
				fish = a;
				food = b;
			}
			else if(b instanceof Fish && a instanceof Food) {
				fish = b;
				food = a;
			}
			else return;

			fish.eat();
			food.respawn();
		}
	}
}
