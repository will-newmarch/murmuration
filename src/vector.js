'use strict';

/**
 * Vector
 * A reference to a point in space.
 */
export default class Vector {

	constructor(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Returns the distance between this vector and the supplied vector as a positive float.
	 * @param  {Vector}
	 * @return {float}
	 */
	getDistanceFrom(vector) {
		var dist = {};
		dist.x = this.x - vector.x;
		dist.y = this.y - vector.y;
		dist.z = this.z - vector.z;
		return Math.abs(
			Math.sqrt(
				dist.x * dist.x +
				dist.y * dist.y +
				dist.z * dist.z
			)
		);
	}

	/**
	 * Normalises the dimensional values of the vector to be a relative portion of the supplied val.
	 * @param  {float|integer}
	 */
	normalise(val) {
		var total = Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
		this.x = val * (this.x / total);
		this.y = val * (this.y / total);
		this.z = val * (this.z / total);
	}

	/**
	 * Adds the supplied vector to this vector.
	 * @param {Vector}
	 */
	addVector(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}

	/**
	 * Multiplies this vector by the supplied number.
	 * @param  {float|integer}
	 */
	multiplyBy(multiplier) {
		this.x *= multiplier;
		this.y *= multiplier;
		this.z *= multiplier;
	}

	/**
	 * Returns the vector in a readable format.
	 * @return {string}
	 */
	print() {
		return "<" + this.x + "," + this.y + "," + this.z + ">";
	}

}