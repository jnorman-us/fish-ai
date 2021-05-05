import { Bodies, Engine } from 'matter-js'

import Entity from './entity.js';

export default class Food extends Entity {
	constructor(options) {
		options.moveable = true;
		options.mass = 1;
		options.collision_category = 0x0002;
		super(options);
	}

	getBody(options) {
		return Bodies.polygon(0, 0, 5, 5);
	}
}
