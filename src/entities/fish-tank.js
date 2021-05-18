import { Bodies, Body } from 'matter-js';

import Entity from './entity.js';

export default class FishTank extends Entity {
	constructor(options) {
		options.moveable = false;
		options.angle = 0;
		options.collision_category = 0x0001;
		super(options);
	}

	getBody(options) {
		const w = options.width;
		const h = options.height;
		const b = options.thickness;

		const render = {
			fillStyle: 'blue',
			strokeStyle: 'blue',
			lineWidth: 5,
		};

		const body = Body.create({
			parts: [
				Bodies.rectangle(w / 2, 0 - b / 2, w + b * 2, b, {
					render: render,
				}), // top rect
				Bodies.rectangle(0 - b / 2, h / 2, b, h, {
					render: render,
				}), // left rect
				Bodies.rectangle(w + b / 2, h / 2, b, h, {
					render: render,
				}), // right rect,
				Bodies.rectangle(w / 2, h + b / 2, h + b * 2, b, {
					render: render,
				}),
			],
		});

		return body;
	}
}
