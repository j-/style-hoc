import { style, interleave, resolveInterpolation } from './index';

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

	it('can be executed with a context', () => {
		expect(() => {
			interface FooProps {
				foo: string;
			}
			const fn = style<FooProps>()`
				foo: ${props => props.foo};
			`;
			const props: FooProps = {
				foo: 'bar',
			};
			const result = fn(props);
		}).not.toThrow();
	});
});

describe('interleave()', () => {
	it('interleaves strings and numbers', () => {
		expect(interleave(['foo', 'bar'], 123)).toEqual(['foo', 123, 'bar']);
		expect(interleave(['foo', 'bar', 'baz'], 123, 456)).toEqual(['foo', 123, 'bar', 456, 'baz']);
	});
});

describe('resolveInterpolation()', () => {
	it('ignores scalar values', () => {
		const context = {};
		expect(resolveInterpolation<typeof context>({}, 'foo')).toBe('foo');
		expect(resolveInterpolation<typeof context>({}, 123)).toBe(123);
	});

	it('does not need a context', () => {
		expect(resolveInterpolation(undefined, 'foo')).toBe('foo');
		expect(resolveInterpolation(null, 'foo')).toBe('foo');
	});

	it('resolves a single level of nesting', () => {
		expect(resolveInterpolation({ x: 'foo' }, (props) => props.x)).toBe('foo');
		expect(resolveInterpolation({ x: 'bar' }, (props) => props.x)).toBe('bar');
	});

	it('resolves a multiple levels of nesting', () => {
		expect(resolveInterpolation({ x: 'foo' }, (props) => (props) => (props) => props.x)).toBe('foo');
	});
});
