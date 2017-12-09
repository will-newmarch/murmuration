import buble  from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
	name: 'Murmuration',
	plugins: [
		uglify(),
		buble()
	],
	input: 'src/murmuration.js',
	output: {
		format: 'iife',
		file: 'build/murmuration.js'
	}
};