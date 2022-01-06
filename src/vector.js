'use strict';

/**
 * Vector
 * A reference to a point in space.
 */
export default class Vector {

	constructor(x = 0., y = 0., z = 0.) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Returns the distance between this vector and the supplied vector as a positive float.
	 * @param  {Vector}
	 * @return {Number}
	 */
	getDistanceFrom(vector) {
		return Math.abs(
			Math.sqrt(
				(this.x - vector.x) * (this.x - vector.x) +
				(this.y - vector.y) * (this.y - vector.y) +
				(this.z - vector.z) * (this.z - vector.z)
			)
		);
	}

	/**
	 * Returns the rough distance between this vector and the supplied vector as a positive float by returning the vector with the smallest difference.
	 * @param  {Vector}
	 * @return {Number}
	 */
	getRoughDistanceFrom(vector) {
		const distances = [
			Math.abs(this.x - vector.x),
			Math.abs(this.y - vector.y),
			Math.abs(this.z - vector.z)
		];
		if(distances[0] < distances[1] && distances[0] < distances[2]) {
			return distances[0];
		} else if(distances[1] < distances[0] && distances[1] < distances[2]) {
			return distances[1];
		} else {
			return distances[2];
		}
	}

	/**
	 * Get the speed of the vector.
	 * @returns {Number}
	 */
	getSpeed() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	/**
	 * Normalizes the vector.
	 */
	normalise() {
		const speed = this.getSpeed();
		this.x /= speed;
		this.y /= speed;
		this.z /= speed;
	}

	/**
	 * Adds the supplied vector to this vector.
	 * @param {Vector}
	 */
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}

	/**
	 * Multiplies this vector by the supplied number.
	 * @param  {Number}
	 */
	multiply(multiplier) {
		this.x *= multiplier;
		this.y *= multiplier;
		this.z *= multiplier;
	}

	/**
	 * Divides this vector by the supplied number.
	 * @param  {Number}
	 */
	 divide(divider) {
		this.x /= divider;
		this.y /= divider;
		this.z /= divider;
	}

	/**
	 * Resets the values of the vector.
	 */
	reset() {
		this.x *= 0.;
		this.y *= 0.;
		this.z *= 0.;
	}

	toArray() {
		return [this.x,this.y,this.z];
	}

	/**
	 * Returns the vector in a readable format.
	 * @return {String}
	 */
	toString() {
		return `<${this.x},${this.y},${this.z}>`;
	}

}