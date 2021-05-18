import { Body, World } from 'matter-js';

export default class Entity {
	constructor(options) {
		this.body = this.getBody(options);

		if(options.position != null)
			Body.setPosition(this.body, options.position);
		if(options.moveable != null)
			Body.setStatic(this.body, !options.moveable);
		if(options.mass != null)
			Body.setMass(this.body, options.mass);
		if(options.angle != null)
			Body.setAngle(this.body, options.angle);
		if(options.collision_mask != null)
			this.body.collisionFilter.mask = options.collision_mask
		this.body.frictionAir = .8;
		this.body.collisionFilter.category = options.collision_category;

		this.body.entity_ref = this;

		for(const part of this.body.parts) {
			part.entity_ref = this;
		}

		this.isInWorld = false;
	}

	addTo(world) {
		this.world = world;

		World.add(this.world, this.body);
		this.isInWorld = true;
	}

	removeFrom() {
		World.remove(this.world, this.body);
		this.isInWorld = false;
	}

	get position() {
		return this.body.position;
	}

	getBody() {
		throw new Error('Not implemented');
	}
}
