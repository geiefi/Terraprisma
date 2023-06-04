import { Accessor, createContext } from 'solid-js';

export type StepsContextProviderValue = [
  current: Accessor<number>,
  count: Accessor<number>
];

export const StepsContext = createContext<StepsContextProviderValue>();
