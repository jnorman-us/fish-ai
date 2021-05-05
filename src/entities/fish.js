import { Bodies, Body, Vector } from 'matter-js';

import Entity from './entity.js';

import Normalizer from '../utils/normalizer.js';

const ML5 = window.ml5;

export default class Fish extends Entity {
	constructor(options) {
		options.moveable = true;
		options.mass = 100;
		options.collision_mask = 0x0001 | 0x0002;
		options.collision_category = 0x0004;
		super(options);

		this.normalizer_dcx = new Normalizer(-600, 600, false);
		this.normalizer_dcy = new Normalizer(-600, 600, false);
		this.normalizer_vx = new Normalizer(-4, 4, false);
		this.normalizer_vy = new Normalizer(-4, 4, false);
		this.expander_a = new Normalizer(0, Math.PI * 2, true);
		this.expander_f = new Normalizer(0, .5, true);

		if(options.brain != null)
			this.brain = options.brain;
		else
			this.brain = Fish.generateBrain();

		this.foods = null;
		this.eaten = 0;
	}

	eat() {
		this.eaten ++;
	}

	setFoods(foods) {
		this.foods = foods;
	}

	tick() {
		var closest_food = null;
		for(const food of this.foods) {
			closest_food = food;
			break;
		}

		const delta_v = Vector.sub(this.position, closest_food != null
			? closest_food.position
			: Vector.create(300, 300));
		const n_dx = this.normalizer_dcx.normalize(delta_v.x);
		const n_dy = this.normalizer_dcy.normalize(delta_v.y);

		const velocity = this.body.velocity;
		const n_vx = this.normalizer_vx.normalize(velocity.x);
		const n_vy = this.normalizer_vy.normalize(velocity.y);

		const outputs = this.brain.predictSync([ n_dx, n_dy, n_vx, n_vy ]);

		const angle = this.expander_a.expand(outputs[0].value);
		const force = this.expander_f.expand(outputs[1].value);

		Body.setAngle(this.body, angle + Math.PI);
		Body.applyForce(this.body, this.body.position, Vector.create(
			force * Math.cos(angle),
			force * Math.sin(angle),
		));
	}

	getBody(options) {
		const body = Body.create({
			parts: [
				Bodies.circle(-7.5, 0, 10),
				Bodies.polygon(7.5, 0, 3, 10),
			],
		});

		return body;
	}

	static generateBrain() {
		const brain = ML5.neuralNetwork({
			task: 'regression',
			noTraining: true,
			inputs: 4, /*[
				'delta_closest_x',
				'delta_closest_y',
				'velocity_x',
				'velocity_y',
			]*/
			outputs: 2,/*[
				'angle',
				'force',
			]*/
		});
		brain.mutate(.1);
		return brain;
	}
}
