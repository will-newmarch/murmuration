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

		let options = {
			starlingCount 		: 768, 	// Count of starlings to murmurate.
			randomiseHome 		: true, // Whether the starlings homing point should be randomised.
			homeChangeInterval 	: 4000, // How often the homing point should changed.
			neighbourDistance 	: 160,  // Ideal distance from neighbour (how much do the starlings like their space?).
			worldWidth  		: 1024,
			worldHeight 		: 768,
			onUpdate 			: function(starlings) {},

			// Tweak the power of various qualities of the murmuration.
			homing 		: 1.,
			alignment 	: 1.,
			cohesion 	: 1.,
			separation 	: 1.,
		};
		
		// Apply any custom parameters that were supplied.
		Object.assign(this,options,args);
		
		// Initial homing point for the starlings.
		this.home = new Vector(
			this.worldWidth  / 2,
			this.worldHeight / 2,
			1
		);

		if(this.randomiseHome) {
			this.changeHome();
		}
		
		// Initialise array to contain references to starlings.
		this.starlings = [];

		// Important modifiers for each of the qualities of the murmuration.
		const mod           = 0.2; // overall skill
		this.homingMod 		= mod * 0.2; // attraction to home
		this.alignmentMod 	= mod * 1.1; // alignment with neighbours
		this.cohesionMod 	= mod * 1.1; // cohesion with neighbours
		this.separationMod 	= mod * 1.1; // separation from neighbours

		// Create the starlings.
		for (let i = 0; i < this.starlingCount; i++) {
			var u = Math.random();
			var v = Math.random();
			var theta = u * 2.0 * Math.PI;
			var phi = Math.acos(2.0 * v - 1.0);
			var r = Math.cbrt(Math.random());
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);
			var x = (r * sinPhi * cosTheta) * 10;
			var y = (r * sinPhi * sinTheta) * 10;
			var z = (r * cosPhi) * 10;
			this.addStarling(this.home.x + x,this.home.y + y,this.home.z + z);
		}

		// Set up the interval for changing the random homing point.
		if(this.randomiseHome) { 
			this.changeHomeFunc = () => {
			  	this.changeHome();
			  	setTimeout(this.changeHomeFunc, this.homeChangeInterval);
			};
			this.changeHomeFunc();
		}

		// Pooled variables to help with maths
		this.averageDistance = new Vector;
		this.averagePosition = new Vector;
		this.averageVelocity = new Vector;
		this.homingVelocity  = new Vector;
		this.neighbourCount  = 0;

		this.distances = [];
		for (let i = 0; i < this.starlingCount; i++) {
			this.distances.push([]);
			for (let j = 0; j < this.starlingCount; j++) {
				this.distances[i].push(0.); 
			}
		}

	}

	/**
	 * Add a starling into the murmuration.
	 */
	addStarling(x,y,z) {
		let starling = new Starling(x,y,z);
		this.starlings.push(starling);
	}

	/**
	 * Change the homing point of the starlings.
	 */
	changeHome() {
		this.home.x = (this.worldWidth / 4) + ((this.worldWidth * Math.random()) / 2);
		this.home.y = (this.worldHeight / 4) + ((this.worldHeight * Math.random()) / 2);
		this.home.z = Math.random() * 10;
	}

	/**
	 * Run render loop to continuously update and re-render the murmuration.
	 */
	run() {
		this.updateStarlings();
		this.onUpdate(this.starlings);
		requestAnimationFrame(() => this.run());
	}

	/**
	 * Apply alignment, cohesion, separation, and homing modifiers to starling.
	 * @param {Starling} starling 
	 */
	modifyStarling(starling,index,distances) {

		this.neighbourCount = 0;

		for (let i = 0; i < this.starlingCount; i++) {

			if (starling != this.starlings[i]) {

				if (distances[index][i] < this.neighbourDistance) {

					this.averageVelocity.x = this.starlings[i].velocity.x;
					this.averageVelocity.y = this.starlings[i].velocity.y;
					this.averageVelocity.z = this.starlings[i].velocity.z;

					this.averageDistance.x = (this.starlings[i].x - starling.x);
					this.averageDistance.y = (this.starlings[i].y - starling.y);
					this.averageDistance.z = (this.starlings[i].z - starling.z);

					this.neighbourCount++;
				}

			}
		}

		this.averageVelocity.x /= this.neighbourCount;
		this.averageVelocity.y /= this.neighbourCount;
		this.averageVelocity.z /= this.neighbourCount;

		this.averageVelocity.normalise();

		this.averageVelocity.multiply(this.alignmentMod);

		this.averageDistance.x /= this.neighbourCount;
		this.averageDistance.y /= this.neighbourCount;
		this.averageDistance.z /= this.neighbourCount;

		this.averageDistance.normalise();

		this.averageDistance.multiply(this.cohesionMod);

		if (this.neighbourCount > 0) {
			starling.velocity.add(this.averageVelocity);
			starling.velocity.add(this.averageDistance);
		}
		
		this.averageDistance.divide(this.cohesionMod);
		this.averageDistance.multiply(this.separationMod);

		if (this.neighbourCount > 0) {
			starling.velocity.x += this.averageDistance.x * -1;
			starling.velocity.y += this.averageDistance.y * -1;
			starling.velocity.z += this.averageDistance.z * -1;
		}

		this.averageVelocity.reset();
		this.averageDistance.reset();
		
		this.homingVelocity.x = (this.home.x - starling.x);
		this.homingVelocity.y = (this.home.y - starling.y);
		this.homingVelocity.z = (this.home.z - starling.z);

		this.homingVelocity.normalise();

		this.homingVelocity.multiply(this.homingMod);

		starling.velocity.add(this.homingVelocity);

		this.homingVelocity.reset();
			
	}

	/**
	 * Apply murmuration qualities to each starling and update them.
	 */
	updateStarlings() {

		for (let i = 0; i < this.starlingCount; i++) {
			for (let j = 0; j < this.starlingCount; j++) {
				this.distances[i][j] = this.starlings[i].getDistanceFrom(this.starlings[j]); 
			}
		}

		for (let i = 0; i < this.starlingCount; i++) {
			this.averagePosition.x += this.starlings[i].x;
			this.averagePosition.y += this.starlings[i].y;
			this.averagePosition.z += this.starlings[i].z;
		}

		this.averagePosition.x /= this.starlings.length - 1;
		this.averagePosition.y /= this.starlings.length - 1;
		this.averagePosition.z /= this.starlings.length - 1;

		for (let i = 0; i < this.starlingCount; i++) {

			this.modifyStarling(this.starlings[i],i,this.distances);
			
		}

		this.averagePosition.reset();

		for (let i = 0; i < this.starlingCount; i++) {

			this.starlings[i].update();
			
		}

	}

}
