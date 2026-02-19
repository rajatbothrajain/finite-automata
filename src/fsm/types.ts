
// δ:Q×Σ→Q : Transition function that takes a current state and an input symbol, and returns the next state; 
export type Transition<State, Symbol extends string = string> =
  (currentState: State, inputSymbol: Symbol) => State;

/*
 * Deterministic Finite Automaton (DFA)
 * Formal definition: (Q, Σ, q0, F, δ)
 * Q : Finite set of possible states;
 * Σ : Finite input alphabet it can process;
 * q0 ∈ Q : Initial state;
 * F ⊆ Q : Set of final states;
 * δ:Q×Σ→Q : Transition function that takes a current state and an input symbol, and returns the next state; 
 *
 */
export interface FiniteAutomationConfig<State, Symbol extends string = string> {
  states: State[];
  alphabet: Symbol[];
  initialState: State;
  acceptStates: State[];
  transitionFn: Transition<State, Symbol>;
}
