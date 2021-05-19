import { Bodies, Body, Vector } from 'matter-js';

import Entity from './entity.js';

import Normalizer from '../utils/normalizer.js';
import random from '../utils/random.js';

const ML5 = window.ml5;

export default class Fish extends Entity {
	constructor(options) {
		options.moveable = true;
		options.mass = 100;
		options.collision_mask = 0x0001 | 0x0002;
		options.collision_category = 0x0004;
		super(options);

		//this.normalizer_a = new Normalizer(0, 2 * Math.PI, true);
		this.normalizer_dcx = new Normalizer(-600, 600, false);
		this.normalizer_dcy = new Normalizer(-600, 600, false);
		this.normalizer_vx = new Normalizer(-4, 4, false);
		this.normalizer_vy = new Normalizer(-4, 4, false);
		this.expander_a = new Normalizer(0, 2 * Math.PI, false);
		this.expander_f = new Normalizer(0, .5, true);

		if(options.brain != null)
			this.brain = options.brain;
		else
			this.brain = Fish.generateBrain();

		this.food = null;
		this.grazed = 0;
		this.eaten = 0;
		this.crashed = 0;
	}

	graze() {
		this.grazed ++;
	}

	crash() {
		this.crashed ++;
	}

	eat() {
		this.eaten ++;
	}

	setFood(food) {
		this.food = food;
	}

	tick() {
		var closest_food = null;

		if(this.food != null)
			closest_food = this.food;
		const distance = Vector.magnitude(Vector.sub(closest_food.position, this.position));

		if(distance < 40) {
			this.eat();
			closest_food.respawn();
		}
		else if(distance < 60) {
			this.graze();
		}

		//const angle = this.body.angle;
		//const n_a = this.normalizer_a.normalize(angle);

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

		Body.setAngle(this.body, angle);
		Body.applyForce(this.body, this.body.position, Vector.create(
			force * Math.cos(angle + Math.PI),
			force * Math.sin(angle + Math.PI),
		));
	}

	getBody(options) {
		const colors = [
			'#f52549', '#f96574', '#ffd54d', '#99be1b', '#00755e'
		];
		const render = {
			fillStyle: colors[Math.floor(random(0, colors.length))],
			strokeStyle: 'white',
			lineWidth: 4,
		};

		const body = Body.create({
			parts: [
				Bodies.circle(-10, 0, 15, {
					render: render,
				}),
				Bodies.polygon(10, 0, 3, 15, {
					render: render,
				}),
			],
		});

		return body;
	}

	reset() {
		this.eaten = 0;
		this.crashed = 0;
	}

	defyGravity(gravity) {
		Body.applyForce(this.body, this.body.position, {
			x: - gravity.x * gravity.scale * this.body.mass * .6,
			y: - gravity.y * gravity.scale * this.body.mass * .6,
		});
	}

	get score() {
		return this.eaten * 200 + this.grazed * 3 - this.crashed * 40;
	}

	get score_string() {
		return `${ this.score } => e:${ this.eaten }; g:${ this.grazed }; c:${ this.crashed }`;
	}

	static generateBrain() {
		const brain = ML5.neuralNetwork({
			task: 'regression',
			noTraining: true,
			inputs: 4, /*[
				'angle'
				'delta_closest_x',
				'delta_closest_y',
				'velocity_x',
				'velocity_y',
			]*/
			outputs: 2,/*[
				'angularVelocity',
				'force',
			]*/
		});
		brain.mutate(1);
		return brain;
	}
}
