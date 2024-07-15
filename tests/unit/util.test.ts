import { describe, expect, it } from 'vitest';
import { networkIsOnline } from '../../src/util.js';

describe('networkIsOnline', () => {
	it('exports a function', () => {
		expect(networkIsOnline).to.be.a('function');
	});
	it('returns a boolean', () => {
		expect(networkIsOnline()).to.be.a('boolean');
	});
});
