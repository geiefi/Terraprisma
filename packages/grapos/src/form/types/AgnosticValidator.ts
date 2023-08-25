import { FormValue } from './FormValue';

/**
 * A type of validation that is agnostic with relation to which field it validates, meaning
 * it can validate all of the fields at the same time.
 */
export type AgnosticValidator = (value: FormValue) => Record<string, string[]>;
