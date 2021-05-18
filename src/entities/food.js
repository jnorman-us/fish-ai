import { Bodies, Body } from 'matter-js'

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
		const body = Bodies.circle(0, 0, 20, {
			render: {
				fillStyle: '#ffffff',
				strokeStyle: '#aaaaaa',
				lineWidth: 5,
			}
		});
		return body;
	}

	respawn() {
		Body.setPosition(this.body, {
			x: random(100, 500),
			y: random(100, 500),
		});
	}
}
