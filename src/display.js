import React from 'react';

import Simulation from './simulation.js';

import './styles/display.css';

export default class Display extends React.Component {
	constructor(props) {
		super(props);

		this.simulation = new Simulation();

		this.mount = null;
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));

		this.simulation.mount(this.mount);
		this.simulation.start();
	}

	handleResize() {
		// this.simulation.unmount();
		// this.simulation.mount(this.mount);
	}

	render() {
		return (
			<div className="display">
				<div className="display-simulation" ref={
					ref => (this.mount = ref)
				} />
			</div>
		);
	}
}
