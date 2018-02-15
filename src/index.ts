export type InterpolationScalar = string | number;
export type InterpolationFunction<T> = (arg: T) => Interpolation<T>;
export type Interpolation<T = void> = InterpolationScalar | InterpolationFunction<T>;

export type ContextFunction<T> = (context: T) => InterpolationScalar[];
export type TemplateFunction<T> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => ContextFunction<T>;
export type StyleFunction = <T>() => TemplateFunction<T>;

export const interleave = <T>(strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => (
	interpolations.reduce((result, interpolation, i) => (
		result.concat(interpolation, strings[i + 1] as string)
	), [strings[0]] as Interpolation<T>[])
);

export const resolveInterpolation = <T>(context: T, interpolation: Interpolation<T>): InterpolationScalar => (
	typeof interpolation === 'function' ?
		resolveInterpolation(context, interpolation(context)) :
		interpolation
);

export const style: StyleFunction = <T = {}>(/* Extensions will go here */): TemplateFunction<T> => (
	(strings, ...interpolations) => (context) => interpolations.map((interpolation) => (
		resolveInterpolation(context, interpolation)
	))
);
