/**
 * A primitive value which will be interpolated into the template string.
 */
export type InterpolationScalar = string | number;

/**
 * A function which, when given an argument of type `T` will return an
 * interpolation of type `T`.
 */
export type InterpolationFunction<T> = (arg: T) => Interpolation<T>;

/**
 * Can be a primitive value or a function which returns another interpolation.
 */
export type Interpolation<T = void> = InterpolationScalar | InterpolationFunction<T>;

/**
 * Signature of the `interleave` function.
 */
export type InterleaveFunction = <T>(strings: string[] | TemplateStringsArray, ...interpolations: InterpolationScalar[]) => InterpolationScalar[];

/**
 * Takes an array of strings and some interpolations and returns the string at
 * index 0 if it exists, then the interpolation at index 0 if it exists, then
 * the string at index 1 if it exists etc.
 *
 * @param strings Array of string literals
 * @param interpolations Primitive values to interleave with the string literals
 */
export const interleave: InterleaveFunction = <T>(strings: string[] | TemplateStringsArray, ...interpolations: InterpolationScalar[]) => {
	const result: InterpolationScalar[] = [];
	for (let i = 0; i < strings.length; i++) {
		result.push(strings[i]);
		if (interpolations[i]) {
			result.push(interpolations[i]);
		}
	}
	return result;
};

/**
 * Signature of the `resolveInterpolation` function.
 */
export type ResolveInterpolationFunction = <T>(context: T, interpolation: Interpolation<T>) => InterpolationScalar;

/**
 * When given a context of type `T` will execute the given interpolation
 * function with that context if the interpolation is a function. Otherwise, if
 * the given interpolation is a primitive value then it will be returned as-is.
 *
 * @param context Any context of type `T`
 * @param interpolation The interpolation to resolve
 */
export const resolveInterpolation: ResolveInterpolationFunction = <T>(context: T, interpolation: Interpolation<T>) => (
	typeof interpolation === 'function' ?
		resolveInterpolation(context, interpolation(context)) :
		interpolation
);

/**
 * A function which takes a context of type `T` and returns an array of strings
 * interleaved with primitive interpolated values.
 */
export type ContextFunction<T> = (context: T) => InterpolationScalar[];

/**
 * A function which takes some string literals and some interpolations and
 * returns function which can resolve those interpolations when given a context
 * of type `T`.
 */
export type TemplateFunction<T> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => ContextFunction<T>;

/**
 * A generic function of type `T` which returns a template string-friendly
 * function with the same generic type.
 */
export type StyleFunction = <T>() => TemplateFunction<T>;

/**
 * Returns a function which, when evaluated with a template string, will
 * eventually return a list of interpolated values when given a context of type
 * `T`.
 */
export const style: StyleFunction = <T = {}>(/* Extensions will go here */): TemplateFunction<T> => (
	(strings, ...interpolations) => (context) => interleave(strings, ...interpolations.map((interpolation) => (
		resolveInterpolation(context, interpolation)
	)))
);
