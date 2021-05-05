import { Engine, Events, Render, Vector, World } from 'matter-js';

import delay from './utils/delay.js';
import random from './utils/random.js';

import Fish from './entities/fish.js';
import FishTank from './entities/fish-tank.js';
import Food from './entities/food.js';

import fishFoodCollisionListener from './listeners/fish-food-collision.js';

export default class Simulation {
	constructor() {
		this.engine = Engine.create();
		this.engine.world.gravity.y = 1;
		this.world = this.engine.world;

		this.fish_tank = new FishTank({
			width: 600,
			height: 600,
			thickness: 10,
			position: { x: 300, y: 300 },
		});
		this.fish_tank.addTo(this.world);

		this.registerListeners();
	}

	async start() {
		this.engine_runner = setInterval(this.tick.bind(this), 30);

		for(var gen = 0; true; gen ++) {
			// generate the food and the fish
			this.fishes = [];
			this.foods = [];

			for(var i = 0; i < 10; i ++) {
				const fish = new Fish({
					position: {
						x: random(0, 600),
						y: random(200, 400),
					},
					angle: random(0, Math.PI * 2),
				});
				fish.setFoods(this.foods);
				fish.addTo(this.world);
				this.fishes.push(fish);
			}

			for(var i = 0; i < 20; i ++) {
				await delay(200);

				const food = new Food({
					position: {
						x: random(0, 600),
						y: 10,
					}
				});
				food.addTo(this.world);
				this.foods.push(food);
			}

			await delay(5000);

			for(const fish of this.fishes) {
				fish.removeFrom();
			}
			for(const food of this.foods) {
				food.removeFrom();
			}
		}
	}

	tick() {
		Engine.update(this.engine, 30);

		for(const fish of this.fishes) {
			fish.tick();
		}
	}

	stop() {
		clearInterval(this.engine_runner);
	}

	mount(element) {
		this.element = element;
		const width = element.clientWidth;
		const height = element.clientHeight;

		this.render = Render.create({
			element: this.element,
			engine: this.engine,
			options: {
				wireframes: false,
				width: width,
				height: height,
			}
		});

		Render.run(this.render);
	}

	unmount() {
		Render.stop(this.render);

		this.element.removeChild(this.render.canvas);
		this.element = null;
		this.render = null;
	}

	registerListeners() {
		Events.on(this.engine, "collisionStart", function(e) {
			fishFoodCollisionListener(e, this);
		});
	}
}
