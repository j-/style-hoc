import { style } from './index';

describe('style()', () => {
	it('is a function', () => {
		expect(typeof style).toBe('function');
	});

	it('takes an array of strings', () => {
		expect(() => {
			style()(['foo', 'bar', 'baz']);
		}).not.toThrow();
	});

	it('takes a function interpolation', () => {
		expect(() => {
			style()(['foo', 'bar', 'baz'], () => 'qux');
		}).not.toThrow();
	});

	it('takes a string interpolation', () => {
		expect(() => {
			style()(['foo', 'bar', 'baz'], 'qux');
		}).not.toThrow();
	});

	it('takes a number interpolation', () => {
		expect(() => {
			style()(['foo', 'bar', 'baz'], 123);
		}).not.toThrow();
	});

	it('takes a recursive function interpolation', () => {
		expect(() => {
			style()(['foo', 'bar', 'baz'], () => () => () => 'qux');
		}).not.toThrow();
	});

	it('can be expressed as a template literal', () => {
		expect(() => {
			style()`foo${0}bar${() => 1}baz${'qux'}`;
		}).not.toThrow();
	});

	it('can take a generic type', () => {
		expect(() => {
			interface FooProps {
				foo: string;
			}
			style<FooProps>()`
				foo: ${props => props.foo};
			`;
		}).not.toThrow();
	});
});
