type InterpolationScalar = string | number;
type InterpolationFunction<T> = (arg: T) => Interpolation<T>;
export type Interpolation<T = void> = InterpolationScalar | InterpolationFunction<T>;

type TemplateFunction<T> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => void;
type StyleFunction = <T>() => TemplateFunction<T>;

export const interleave = <T>(strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => (
	interpolations.reduce((result, interpolation, i) => (
		result.concat(interpolation, strings[i + 1] as string)
	), [strings[0]] as Interpolation<T>[])
);

export const style: StyleFunction = <T = {}>(/* Extensions will go here */): TemplateFunction<T> => (
	(strings, ...interpolations) => interleave<T>(strings, ...interpolations)
);
