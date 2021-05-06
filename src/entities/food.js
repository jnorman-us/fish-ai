import { Bodies, Body, Engine } from 'matter-js'

import Entity from './entity.js';

import random from '../utils/random.js';

export default class Food extends Entity {
	constructor(options) {
		options.moveable = true;
		options.mass = 1;
		options.collision_category = 0x0002;
		super(options);
	}

	getBody(options) {
		return Bodies.circle(0, 0, 20);
	}

	respawn() {
		Body.setPosition(this.body, {
			x: random(0, 600),
			y: random(20, 100),
		});
	}
}
