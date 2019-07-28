'use strict';

import Starling from './Starling.js';
import Vector from './Vector.js';

/**
 * Murmuration
 * 
 * Definition: 
 * murmuration (noun)
 * məːməːˈreɪʃ(ə)n
 * 
 * 1. the action of murmuring.
 * "the murmuration of a flock of warblers"
 * 
 * 2. a flock of starlings. (rare)
 * 
 */
export default class Murmuration {

	constructor(args) {
		
		// Count of starlings to murmurate.
		this.starlingCount = 200;
		
		// Power of various qualities of the murmuration.
		this.homing 	= 1;
		this.alignment 	= 1;
		this.cohesion 	= 1;
		this.separation = 1;
		
		// Whether the starlings homing point should be randomised.
		this.randomiseHome = true;

		// How often the homing point should changed.
		this.homeChangeInterval = 3000;

		// Ideal distance from neighbour (how much do the starlings like their space?).
		this.neighbourDistance = 400;

		// Parent element the starlings will be contained in.
		this.parentElem = document.body;

		// Grab initial width and height of selected parent element.
		this.worldWidth  = 100;
		this.worldHeight = 100;
		
		// Initial homing point for the starlings.
		this.home = new Vector(
			this.worldWidth  / 2,
			this.worldHeight / 2,
			0
		);
		
		// Initialise array to contain references to starlings.
		this.starlings = [];

		// Important modifiers for each of the qualities of the murmuration.
		this.homingMod 		= this.homing * 0.022;
		this.alignmentMod 	= this.alignment * 0.00018;
		this.cohesionMod 	= this.cohesion * 7;
		this.separationMod 	= this.separation * 5.994;

		this.onUpdate = function(starlings) {}

		// Apply any custom parameters that were supplied.
		Object.assign(this, args);

		// Create the starlings.
		for (let i = 0; i < this.starlingCount; i++) {
			this.addStarling();
		}

		// Set up the interval for changing the random homing point.
		if(this.randomiseHome) { 
			this.changeHomeFunc = () => {
			  	this.changeHome();
			  	setTimeout(this.changeHomeFunc, this.homeChangeInterval);
			};
			this.changeHomeFunc();
		}

		// Pooled vectors to help with maths
		this.averageDistance = new Vector;
		this.averagePosition = new Vector;
		this.averageVelocity = new Vector;
		this.homingVelocity  = new Vector;
	}

	/**
	 * Add a starling into the murmuration.
	 */
	addStarling() {
		let x = ((Math.random() * this.worldWidth) / 4) + this.worldWidth / 4;
		let y = ((Math.random() * this.worldHeight) / 4) + this.worldHeight / 4;
		let starling = new Starling(x,y,0);
		this.starlings.push(starling);
	}

	/**
	 * Change the homing point of the starlings.
	 */
	changeHome() {
		this.home.x = this.worldWidth * Math.random();
		this.home.y = this.worldHeight * Math.random();
		this.home.z = 0.1;
	}

	/**
	 * Run render loop to continuously update and re-render the murmuration.
	 */
	run() {
		requestAnimationFrame(() => this.run());
		this.updateStarlings();
		this.onUpdate(this.starlings);
	}

	/**
	 * Apply acceleration to starling to encourage it to fly in the same direction as the rest of the starlings.
	 * @param  {Starling}
	 */
	alignStarling(starling) {

		let neighbourCount = 0;

		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this.starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					this.averageVelocity.x = otherStarling.velocity.x;
					this.averageVelocity.y = otherStarling.velocity.y;
					this.averageVelocity.z = otherStarling.velocity.z;

					neighbourCount++;
				}
			}
		}

		this.averageVelocity.x /= neighbourCount;
		this.averageVelocity.y /= neighbourCount;
		this.averageVelocity.z /= neighbourCount;

		this.averageVelocity.normalise(1);

		this.averageVelocity.multiply(this.alignmentMod);

		if (neighbourCount > 0) {
			starling.velocity.add(this.averageVelocity);
		}

		this.averageVelocity.reset();
	}

	/**
	 * Apply acceleration to starling to try and stay in the flock with the rest of the starlings.
	 * @param  {Starling}
	 */
	cohereStarling(starling) {

		let neighbourCount = 0;

		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this.starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					this.averageDistance.x = (otherStarling.x - starling.x);
					this.averageDistance.y = (otherStarling.y - starling.y);
					this.averageDistance.z = (otherStarling.z - starling.z);

					neighbourCount++;
				}

				this.averagePosition.x += otherStarling.x;
				this.averagePosition.y += otherStarling.y;
				this.averagePosition.z += otherStarling.z;
			}

		}

		this.averagePosition.x /= this.starlings.length - 1;
		this.averagePosition.y /= this.starlings.length - 1;
		this.averagePosition.z /= this.starlings.length - 1;

		this.averageDistance.x /= neighbourCount;
		this.averageDistance.y /= neighbourCount;
		this.averageDistance.z /= neighbourCount;

		this.averageDistance.normalise(1);

		this.averageDistance.multiply(this.cohesionMod);

		if (neighbourCount > 0) {
			starling.velocity.add(this.averageDistance);
		}

		this.averageDistance.reset();
		this.averagePosition.reset();
	}

	/**
	 * Apply acceleration to starling to keep distance from other starlings.
	 * @param  {Starling}
	 */
	separateStarling(starling) {

		let neighbourCount = 0;
	
		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this.starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					this.averageDistance.x = (otherStarling.x - starling.x);
					this.averageDistance.y = (otherStarling.y - starling.y);
					this.averageDistance.z = (otherStarling.z - starling.z);

					neighbourCount++;
				}
			}
		}

		this.averageDistance.x /= neighbourCount;
		this.averageDistance.y /= neighbourCount;
		this.averageDistance.z /= neighbourCount;

		this.averageDistance.normalise(1);

		this.averageDistance.multiply(this.separationMod);

		if (neighbourCount > 0) {
			starling.velocity.x += this.averageDistance.x * -1;
			starling.velocity.y += this.averageDistance.y * -1;
			starling.velocity.z += this.averageDistance.z * -1;
		}

		this.averageDistance.reset();
	}

	/**
	 * Apply acceleration to starling towards home.
	 * @param  {Starling}
	 */
	homeStarling(starling) {

		// Home onto homing coords
		this.homingVelocity.x = (this.home.x - starling.x);
		this.homingVelocity.y = (this.home.y - starling.y);
		this.homingVelocity.z = (this.home.z - starling.z);

		this.homingVelocity.normalise(1);

		this.homingVelocity.multiply(this.homingMod * (Math.random() * 10));

		starling.velocity.add(this.homingVelocity);

		this.homingVelocity.reset();
	}

	/**
	 * Apply murmuration qualities to each starling and update them.
	 */
	updateStarlings() {

		for (let i = 0; i < this.starlingCount; i++) {

			let starling = this.starlings[i];

			this.alignStarling(starling);

			this.cohereStarling(starling);

			this.separateStarling(starling);

			this.homeStarling(starling);

			starling.update();
		}
	}

}
