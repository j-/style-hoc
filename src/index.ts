type InterpolationScalar = string | number;
type InterpolationFunction<P> = (arg: P) => Interpolation<P>;
export type Interpolation<P = void> = InterpolationScalar | InterpolationFunction<P>;

export const style = <P = {}>(/* Extensions will go here */) => (
	(strings: string[] | TemplateStringsArray, ...interpolations: Interpolation<P>[]) => {}
);
