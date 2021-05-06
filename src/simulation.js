import { Engine, Events, Render, Vector, World } from 'matter-js';

import delay from './utils/delay.js';
import random from './utils/random.js';

import Fish from './entities/fish.js';
import FishTank from './entities/fish-tank.js';
import Food from './entities/food.js';

import fishFoodCollisionListener from './listeners/fish-food-collision.js';
import fishWallCollisionListener from './listeners/fish-wall-collision.js';


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
		this.best_fish = new Fish({});
		this.current_fish = new Fish({});

		this.engine_runner = setInterval(this.tick.bind(this), 30);

		for(var gen = 0; true; gen ++) {
			console.log(`Generation ${ gen }\n-----\nCurrent: ${ this.current_fish.score }\nBest: ${ this.best_fish.score}`);

			await this.generateGeneration();
			await delay(7000);


			this.current_fish = new Fish({});
			for(const fish of this.fishes) {
				if(fish.score > this.current_fish.score) {
					this.current_fish = fish;
				}
			}

			if(this.current_fish.score > this.best_fish.score) {
				this.best_fish = this.current_fish;
			}

			this.destroyGeneration();
		}
	}

	async generateGeneration() {
		// generate the food and the fish
		this.fishes = [];
		this.foods = [];

		for(var i = 0; i < 20; i ++) {
			var new_brain = null;
			if(i == 0)
				new_brain = this.best_fish.brain.copy();
			if(i > 0)
				new_brain = this.current_fish.brain.copy();
			if(i > 1)
				new_brain.mutate(1);

			const fish = new Fish({
				position: {
					x: random(0, 600),
					y: random(200, 400),
				},
				angle: random(0, Math.PI * 2),
				brain: new_brain,
			});
			fish.reset();
			fish.setFoods(this.foods);
			fish.addTo(this.world);
			this.fishes.push(fish);
		}

		for(var i = 0; i < 1; i ++) {
			const food = new Food({});
			food.addTo(this.world);
			food.respawn();
			this.foods.push(food);
		}
	}

	destroyGeneration() {
		for(const fish of this.fishes) {
			fish.removeFrom();
		}
		for(const food of this.foods) {
			food.removeFrom();
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
			fishWallCollisionListener(e, this);
		});
	}
}
