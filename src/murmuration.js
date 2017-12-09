'use strict';

import Starling from './starling.js';
import Vector from './vector.js';

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
		this.homeChangeInterval = 1000;

		// Ideal distance from neighbour (how much do the starlings like their space?).
		this.neighbourDistance = 400; // 400000

		// Parent element the starlings will be contained in.
		this.parentElem = document.body;

		// Grab initial width and height of selected parent element.
		this._canvasWidth = this.parentElem.offsetWidth;
		this._canvasHeight = this.parentElem.offsetHeight;
		
		// Initial homing point for the starlings.
		this.home = new Vector(
			this._canvasWidth / 2,
			this._canvasHeight / 2,
			0
		);
		
		// Initialise array to contain references to starlings.
		this._starlings = [];

		// Important modifiers for each of the qualities of the murmuration.
		this._homingMod 	= this.homing * 0.024;
		this._alignmentMod 	= this.alignment * 0.00018;
		this._cohesionMod 	= this.cohesion * 6;
		this._separationMod = this.separation * 5.994;

		// Apply any custom parameters that were supplied.
		Object.assign(this, args);

		// Create the starlings.
		for (let i = 0; i < this.starlingCount; i++) {
			this._addStarling();
		}

		// Set up the interval for changing the random homing point.
		if(this.randomiseHome) { 
			this._changeHomeFunc = () => {
			  	this._changeHome();
			  	setTimeout(this._changeHomeFunc, this.homeChangeInterval);
			};
			this._changeHomeFunc();
		}
	}

	/**
	 * Generates the HTML Element used to represent the starling.
	 * @return {HTMLElement}
	 */
	generateStarlingElement() {
		let el = document.createElement('starling');
		el.style.backgroundColor = 'black';
		el.style.position = 'absolute';
		el.style.width = '30px';
		el.style.height = '30px';
		return el;
	}

	/**
	 * Add a starling into the murmuration.
	 */
	_addStarling() {
		let x = ((Math.random() * this._canvasWidth) / 4) + this._canvasWidth / 4;
		let y = ((Math.random() * this._canvasHeight) / 4) + this._canvasHeight / 4;
		let el = this.generateStarlingElement();
		let starling = new Starling(x,y,0,el);
		this._starlings.push(starling);
		this.parentElem.append(starling.elem);
	}

	/**
	 * Change the homing point of the starlings.
	 */
	_changeHome() {
		this.home.x = this._canvasWidth * Math.random();
		this.home.y = this._canvasHeight * Math.random();
		this.home.z = 0.1;
	}

	/**
	 * Run render loop to continuously update and re-render the murmuration.
	 */
	run() {
		requestAnimationFrame(() => this.run());
		this.updateStarlings();
	}

	/**
	 * Apply acceleration to starling to encourage it to fly in the same direction as the rest of the starlings.
	 * @param  {Starling}
	 */
	_alignStarling(starling) {

		let neighbourCount = 0;
		let averageVel = new Vector;

		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this._starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					averageVel.x = otherStarling.vel.x;
					averageVel.y = otherStarling.vel.y;
					averageVel.z = otherStarling.vel.z;

					neighbourCount++;
				}
			}
		}

		averageVel.x /= neighbourCount;
		averageVel.y /= neighbourCount;
		averageVel.z /= neighbourCount;

		averageVel.normalise(1);

		averageVel.multiplyBy(this._alignmentMod);

		if (neighbourCount > 0) {
			starling.vel.addVector(averageVel);
		}

		averageVel = undefined;
	}

	/**
	 * Apply acceleration to starling to try and stay in the flock with the rest of the starlings.
	 * @param  {Starling}
	 */
	_cohereStarling(starling) {

		let neighbourCount = 0;
		let averageDist = new Vector;
		let averagePos = new Vector;

		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this._starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					averageDist.x = (otherStarling.x - starling.x);
					averageDist.y = (otherStarling.y - starling.y);
					averageDist.z = (otherStarling.z - starling.z);

					neighbourCount++;
				}

				averagePos.x += otherStarling.x;
				averagePos.y += otherStarling.y;
				averagePos.z += otherStarling.z;
			}

		}

		averagePos.x /= this._starlings.length - 1;
		averagePos.y /= this._starlings.length - 1;
		averagePos.z /= this._starlings.length - 1;

		averageDist.x /= neighbourCount;
		averageDist.y /= neighbourCount;
		averageDist.z /= neighbourCount;

		averageDist.normalise(1);

		averageDist.multiplyBy(this._cohesionMod);

		if (neighbourCount > 0) {
			starling.vel.addVector(averageDist);
		}

		averageDist = undefined;
		averagePos  = undefined;
	}

	/**
	 * Apply acceleration to starling to keep distance from other starlings.
	 * @param  {Starling}
	 */
	_separateStarling(starling) {

		let neighbourCount = 0;
		let averageDist = new Vector;

		for (let i = 0; i < this.starlingCount; i++) {
			let otherStarling = this._starlings[i];

			if (starling != otherStarling) {

				if (starling.getDistanceFrom(otherStarling) < this.neighbourDistance) {

					averageDist.x = (otherStarling.x - starling.x);
					averageDist.y = (otherStarling.y - starling.y);
					averageDist.z = (otherStarling.z - starling.z);

					neighbourCount++;
				}
			}
		}

		averageDist.x /= neighbourCount;
		averageDist.y /= neighbourCount;
		averageDist.z /= neighbourCount;

		averageDist.normalise(1);

		averageDist.multiplyBy(this._separationMod);

		if (neighbourCount > 0) {
			starling.vel.x += averageDist.x * -1;
			starling.vel.y += averageDist.y * -1;
			starling.vel.z += averageDist.z * -1;
		}

		averageDist = undefined;
	}

	/**
	 * Apply acceleration to starling towards home.
	 * @param  {Starling}
	 */
	_homeStarling(starling) {

		let homingVel = new Vector;

		// Home onto homing coords
		homingVel.x = (this.home.x - starling.x);
		homingVel.y = (this.home.y - starling.y);
		homingVel.z = (this.home.z - starling.z);

		homingVel.normalise(1);

		homingVel.multiplyBy(this._homingMod * (Math.random() * 10));

		starling.vel.addVector(homingVel);

		homingVel = undefined;
	}

	/**
	 * Apply murmuration qualities to each starling and update them.
	 */
	updateStarlings() {

		for (let i = 0; i < this.starlingCount; i++) {

			let starling = this._starlings[i];

			this._alignStarling(starling);

			this._cohereStarling(starling);

			this._separateStarling(starling);

			this._homeStarling(starling);

			starling.update();
		}
	}

}
