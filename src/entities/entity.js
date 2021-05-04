import { Body, World } from 'matter-js';

export default class Entity {
	constructor(options) {
		this.body = this.getBody();

		if(options.position != null)
			Body.setPosition(this.body, options.position);
		if(options.moveable != null)
			Body.setStatic(this.body, !options.moveable);
		if(options.mass != null)
			Body.setMass(this.body, options.mass);
		if(options.angle != null)
			Body.setAngle(this.body, options.angle);
	}

	addTo(world) {
		this.world = world;

		World.add(this.world, this.body);
	}

	removeFrom() {
		World.remove(this.world, this.body);
	}

	getBody() {
		throw new Error('Not implemented');
	}
}
