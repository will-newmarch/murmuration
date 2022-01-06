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

		this.zMod = 0.003;

		// Set a max speed as starlings have a terminal velocity.
		this.maxSpeed = 3 + Math.random();

		// Give the starling an initial speed.
		const u = Math.random();
		const v = Math.random();
		const theta = u * 2.0 * Math.PI;
		const phi = Math.acos(2.0 * v - 1.0);
		const r = Math.cbrt(Math.random());
		const sinTheta = Math.sin(theta);
		const cosTheta = Math.cos(theta);
		const sinPhi = Math.sin(phi);
		const cosPhi = Math.cos(phi);
		const vx = r * sinPhi * cosTheta;
		const vy = r * sinPhi * sinTheta;
		const vz = r * cosPhi;
		this.velocity = new Vector(vx,vy,vz);
		this.velocity.normalise();

		// Give this starling a skill rating of how well it can coupe with flying in a group.
		// Lower skill means it can fly more freely.
		this.skill = 10 + (Math.random() * 2);

		this.skillVariant = new Vector;

	}

	/**
	 * Update the starling's position based on its velocity and then re-render.
	 */
	update() {
		this.skillVariant.x = (Math.random() - 0.5) / this.skill;
		this.skillVariant.y = (Math.random() - 0.5) / this.skill;
		this.skillVariant.z = (Math.random() - 0.5) / this.skill;

		// Normalise the starling's speed.
		this.velocity.normalise();
		this.velocity.multiply(this.maxSpeed);

		// Add a random velocity based on the starling's skill.
		this.velocity.add(this.skillVariant);

		// Apply the current velocity to the current position.
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.z += this.velocity.z;

		this.skillVariant.reset();
	}
}
