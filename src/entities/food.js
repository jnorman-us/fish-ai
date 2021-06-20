import { Bodies, Body } from 'matter-js'

import Entity from './entity.js';

import random from '../utils/random.js';

export default class Food extends Entity {
	constructor(options) {
		options.moveable = true;
		options.mass = 1;
		options.collision_mask = 0x0001;
		options.collision_category = 0x0002;
		options.color = options.color;
		super(options);

		this.active = true;
	}

	getBody(options) {
		const body = Bodies.circle(0, 0, 10, {
			render: {
				fillStyle: options.color,
				strokeStyle: '#aaaaaa',
				lineWidth: 5,
			}
		});
		return body;
	}

	respawn() {
		Body.setPosition(this.body, {
			x: random(100, 500),
			y: random(100, 400),
		});
	}

	deactivate() {
		this.active = false;
	}
}
