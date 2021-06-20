import Food from '../entities/food.js';
import FishTank from '../entities/fish-tank.js';

export default function foodWallCollisionListener(e, simulation) {
	for(const pair of e.pairs) {
		const a = pair.bodyA.entity_ref;
		const b = pair.bodyB.entity_ref;

		if(a != null && b != null) {
			var food = null;
			//var wall = null;

			if(a instanceof Food && b instanceof FishTank) {
				food = a;
				//wall = b;
			}
			else if(b instanceof Food && a instanceof FishTank) {
				food = b;
				//wall = a;
			}
			else return;

			if(food.position.y > 550) {
				food.active = false;
				food.removeFrom();

				var still_going = false;
				for(const { food } of simulation.pairs) {
					console.log(food.active);
					if(food.active) {
						still_going = true;
						break;
					}
				}

				if(!still_going) {
					simulation.endEpoch();
				}

				// simulation.endEpoch();
			}
		}
	}
}
