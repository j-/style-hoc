export type InterpolationScalar = string | number;
export type InterpolationFunction<T> = (arg: T) => Interpolation<T>;
export type Interpolation<T = void> = InterpolationScalar | InterpolationFunction<T>;

export type InterleaveFunction = <T>(strings: string[] | TemplateStringsArray, ...interpolations: InterpolationScalar[]) => InterpolationScalar[];
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

export type ResolveInterpolationFunction = <T>(context: T, interpolation: Interpolation<T>) => InterpolationScalar;
export const resolveInterpolation: ResolveInterpolationFunction = <T>(context: T, interpolation: Interpolation<T>) => (
	typeof interpolation === 'function' ?
		resolveInterpolation(context, interpolation(context)) :
		interpolation
);

export type ContextFunction<T> = (context: T) => InterpolationScalar[];
export type TemplateFunction<T> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => ContextFunction<T>;
export type StyleFunction = <T>() => TemplateFunction<T>;
export const style: StyleFunction = <T = {}>(/* Extensions will go here */): TemplateFunction<T> => (
	(strings, ...interpolations) => (context) => interleave(strings, ...interpolations.map((interpolation) => (
		resolveInterpolation(context, interpolation)
	)))
);
