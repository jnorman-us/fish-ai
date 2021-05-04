import { Engine, Render, Vector, World } from 'matter-js';

import FishTank from './entities/fish-tank.js';

export default class Simulation {
	constructor() {
		this.engine = Engine.create();
		this.engine.world.gravity.y = 1;
		this.world = this.engine.world;

		this.fish_tank = new FishTank({
			position: { x: 320, y: 320 },
		});
		this.fish_tank.addTo(this.world);
	}

	start() {
		this.engine_runner = setInterval(this.tick.bind(this), 100);
	}

	tick() {
		Engine.update(this.engine, 100);
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
				wireframes: true,
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
}
