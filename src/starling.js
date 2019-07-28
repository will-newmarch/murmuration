'use strict';

import Vector from './Vector.js';

/**
 * Starling
 * A gregarious Old World songbird with a straight bill, 
 * typically with dark lustrous or iridescent plumage 
 * but sometimes brightly coloured.
 */
export default class Starling extends Vector {

	constructor(x,y,z) { 
		super(x,y,z);

		this.zMod = 0.0001;

		// Give the starling an initial speed.
		this.velocity = new Vector(Math.random(),Math.random(),Math.random());

		// Set a max speed as starlings have a terminal velocity.
		this.maxSpeed = 6;

		// Give this starling a skill rating of how well it can coupe with flying in a group.
		this.skill = Math.random() / 10;

		this.skillVariant = new Vector;
	}

	/**
	 * Update the starling's position based on its velocity and then re-render.
	 */
	update() {
		this.skillVariant.x = (Math.random() - 0.5) * this.skill;
		this.skillVariant.y = (Math.random() - 0.5) * this.skill;
		this.skillVariant.z = (Math.random() - 0.5) * this.skill;

		// Normalise the starling's speed.
		this.velocity.normalise(this.maxSpeed);

		// Add a random velocity based on the starling's skill.
		this.velocity.add(this.skillVariant);

		// Apply the current velocity to the current position.
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.z += this.velocity.z;

		this.skillVariant.reset();
	}
}
