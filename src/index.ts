type InterpolationScalar = string | number;
type InterpolationFunction<T> = (arg: T) => Interpolation<T>;
export type Interpolation<T = void> = InterpolationScalar | InterpolationFunction<T>;

type TemplateFunction<T> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<T>[]) => void;
type StyleFunction = <T>() => TemplateFunction<T>;

export const style: StyleFunction = <T = {}>(/* Extensions will go here */): TemplateFunction<T> => (
	(strings, ...interpolations) => {/* Function logic will go here */}
);
