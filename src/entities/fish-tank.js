import { Bodies, Body } from 'matter-js';

import Entity from './entity.js';

export default class FishTank extends Entity {
	constructor(options) {
		options.moveable = false;
		options.angle = 0;
		options.mass = 100;
		super(options);
	}

	getBody() {
		const w = 600;
		const h = 600;
		const b = 10;

		console.log(this);

		const body = Body.create({
			parts: [
				Bodies.rectangle(w / 2, 0 - b / 2, w, b), // top rect
				Bodies.rectangle(0 - b / 2, h / 2, b, h), // left rect
				Bodies.rectangle(w + b / 2, h / 2, b, h), // right rect,
				Bodies.rectangle(w / 2, h + b / 2, h, b),
			],
		})

		console.log(body);
		return body;
	}
}
