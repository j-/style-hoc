type InterpolationScalar = string | number;
type InterpolationFunction<P> = (arg: P) => Interpolation<P>;
export type Interpolation<P = void> = InterpolationScalar | InterpolationFunction<P>;

type TemplateFunction<P> = (strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<P>[]) => void;
type StyleFunction = <P>() => TemplateFunction<P>;

export const style: StyleFunction = <P = {}>(/* Extensions will go here */): TemplateFunction<P> => (
	(strings, ...interpolations) => {/* Function logic will go here */}
);
