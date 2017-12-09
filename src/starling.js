'use strict';

import Vector from './vector.js';

/**
 * Starling
 * A gregarious Old World songbird with a straight bill, 
 * typically with dark lustrous or iridescent plumage 
 * but sometimes brightly coloured.
 */
export default class Starling extends Vector {

	constructor(x,y,z,elem) { 
		super(x,y,z);

		// Set up the element parameters.
		this.elem 	 = elem;
		this._width  = this.elem.offsetWidth;
		this._height = this.elem.offsetHeight;

		this.zMod = 0.0001;

		// Give the starling an initial speed.
		this.vel = new Vector(0.1, 0, 0);

		// Set a max speed as starlings have a terminal velocity.
		this.maxSpeed = 6;

		// Give this starling a skill rating of how well it can coupe with flying in a group.
		this.skill = Math.random() / 10;
	}

	/**
	 * Update the render of the starling 
	 */
	_render() {
		//let opacity 	= (this.z / 1000) + 0.8;
		//let width 		= ((this._width  * (this.z * this.zMod)) + this._width  / 2) + "px";
		//let height  	= ((this._height * (this.z * this.zMod)) + this._height / 2) + "px";
		let scale 		= ((100 * (this.z * this.zMod))+1);
		let transform 	= 'scale(' + (scale < 0 ? 0 : scale) + ')';
		let left 		= this.x + "px";
		let bottom 		= this.y + "px";

		Object.assign(this.elem.style, {
			transform,
			left,
			bottom
		});
	}

	/**
	 * Update the starling's position based on its velocity and then re-render.
	 */
	update() {

		let skillVariant = new Vector;

		skillVariant.x = (Math.random() - 0.5) * this.skill;
		skillVariant.y = (Math.random() - 0.5) * this.skill;
		skillVariant.z = (Math.random() - 0.5) * this.skill;

		// Normalise the starling's speed.
		this.vel.normalise(this.maxSpeed);

		// Add a random velocity based on the starling's skill.
		this.vel.addVector(skillVariant);

		// Apply the current velocity to the current position.
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.z += this.vel.z;

		// Render the starling.
		this._render();

		skillVariant = undefined;
	}
}
