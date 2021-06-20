import { Engine, Events, Render } from 'matter-js';
import distinctColors from 'distinct-colors';

import random from './utils/random.js';

import Fish from './entities/fish.js';
import FishTank from './entities/fish-tank.js';
import Food from './entities/food.js';

import fishFoodCollisionListener from './listeners/fish-food-collision.js';
import fishWallCollisionListener from './listeners/fish-wall-collision.js';
import foodWallCollisionListener from './listeners/food-wall-collision.js';

export default class Simulation {
	constructor() {
		this.engine = Engine.create();
		this.engine.world.gravity.y = 1;
		this.world = this.engine.world;

		this.fish_tank = new FishTank({
			width: 600,
			height: 600,
			thickness: 30,
			position: { x: 300, y: 300 },
		});
		this.fish_tank.addTo(this.world);

		this.registerListeners();

		this.count = 25;
		this.colors = distinctColors({
			count: this.count,
			lightMin: 50,
		});
	}

	async start() {
		this.best_brain = Fish.generateBrain();
		this.best_score = 0;
		this.best_score_string = 0;
		this.current_brain = Fish.generateBrain();
		this.current_score = 0;
		this.current_score_string = 0;

		this.engine_runner = setInterval(this.tick.bind(this), 10);

		for(var gen = 0; true; gen ++) {
			console.log(`Generation ${ gen }\n-----\nCurrent: ${ this.current_score_string }\nBest: ${ this.best_score_string }`);

			await this.generateGeneration();
			await this.waitEpochEnd(); // wait for the food to hit the ground

			this.current_score = - 10000;
			for(const { fish } of this.pairs) {
				if(fish.score >= this.current_score) {
					this.current_brain = fish.brain.copy();
					this.current_score = fish.score;
					this.current_score_string = fish.score_string;
				}
				if(fish.score >= this.best_score) {
					this.best_brain = fish.brain.copy();
					this.best_score = fish.score;
					this.best_score_string = fish.score_string;
				}
			}

			this.destroyGeneration();
		}
	}

	async generateGeneration() {
		// generate the food and the fish
		this.pairs = [];

		const mutation_rate = .5;

		for(var i = 0; i < this.count; i ++) {
			const color = this.colors[i].hex();
			const group = i + 1;

			const food = new Food({
				position: {
					x: random(100, 500),
					y: random(100, 400),
				},
				angle: 0,
				collision_group: group,
				color: color,
			});
			food.addTo(this.world);

			var new_brain = this.current_brain.copy();
			new_brain.mutate(mutation_rate);

			const fish = new Fish({
				position: {
					x: random(100, 500),
					y: random(100, 500),
				},
				angle: random(0, Math.PI),
				brain: new_brain,
				food: food,
				collision_group: group,
				color: color,
			});
			fish.addTo(this.world);

			this.pairs.push({
				food: food,
				fish: fish,
			});
		}
	}

	destroyGeneration() {
		for(const { fish, food } of this.pairs) {
			fish.removeFrom();
			food.removeFrom();
		}
	}

	waitEpochEnd() {
		var self = this;

		return new Promise(function(resolve) {
			self.endEpochResolve = resolve.bind(self);
		});
	}

	endEpoch() {
		if(this.pairs)
		if(this.endEpochResolve != null)
			this.endEpochResolve();
	}

	tick() {
		for(const { fish } of this.pairs) {
			fish.defyGravity(this.world.gravity);
		}

		Engine.update(this.engine, 50);

		for(const { fish } of this.pairs) {
			if(fish.isInWorld)
				fish.tick();
		}

		var still_going = false;
		for(const { food, fish } of this.pairs) {
			if(food.position.y > 575) {
				food.active = false;
				fish.removeFrom();
				food.removeFrom();
			}

			if(food.active) {
				still_going = true;
			}
		}

		if(!still_going) {
			this.endEpoch();
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
				width: 650,
				height: 650,
				background: '#6dd8db',
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
		var self = this;

		Events.on(this.engine, "collisionStart", function(e) {
			fishFoodCollisionListener(e, self);
			//foodWallCollisionListener(e, self);
		});

		Events.on(this.engine, "collisionActive", function(e) {
			fishWallCollisionListener(e, self);
			//foodWallCollisionListener(e, self);
		});
	}
}
