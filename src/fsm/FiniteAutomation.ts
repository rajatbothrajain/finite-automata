import { Transition, FiniteAutomationConfig } from "./types";

/**
 * Deterministic Finite Automaton (DFA).
 *
 * Maintains strict runtime validation to ensure:
 * - Initial state ∈ allStates
 * - Final states ⊆ allStates
 * - Transitions always produce valid states
 */
export class FiniteAutomation<State, Symbol extends string = string> {
  private readonly allStates: Set<State>;
  private readonly inputAlphabet: Set<Symbol>;
  private readonly initialState: State;
  private readonly acceptStates: Set<State>;
  private readonly transitionFn: Transition<State, Symbol>;

  constructor(config: FiniteAutomationConfig<State, Symbol>) {
    const {
      states,
      alphabet,
      initialState,
      acceptStates,
      transitionFn,
    } = config;

    if (states.length === 0) {
      throw new Error("States must be a non-empty array.");
    }

    if (alphabet.length === 0) {
      throw new Error("Alphabet must be a non-empty array.");
    }

    if (typeof transitionFn !== "function") {
      throw new TypeError("Transition function must be a function.");
    }

    this.allStates = new Set(states);
    this.inputAlphabet = new Set(alphabet);
    this.initialState = initialState;
    this.acceptStates = new Set(acceptStates);
    this.transitionFn = transitionFn;

    // Ensure initial state is valid
    if (!this.allStates.has(this.initialState)) {
      throw new Error("Initial state must be one of the defined states.");
    }

    // Ensure all accepting states are valid
    for (const acceptState of this.acceptStates) {
      if (!this.allStates.has(acceptState)) {
        throw new Error("Accept state must be one of the defined states.");
      }
    }
  }


  
  /**
   * Executes the DFA on the given input string.
   *
   * Throws if:
   * - Input contains symbols outside of allowed alphabets i.e Σ
   * - Transition function produces an invalid state
   *
   * Returns the final state after processing all symbols.
   */
  public run(input: string): State {
    if (typeof input !== "string") {
      throw new TypeError("Input must be a string");
    }

    let currentState = this.initialState;

    for (const inputSymbol of input) {
      if (!this.inputAlphabet.has(inputSymbol as Symbol)) {
        throw new Error(`Invalid symbol: ${inputSymbol}`);
      }

      currentState = this.transitionFn(currentState, inputSymbol as Symbol);

      if (!this.allStates.has(currentState)) {
        throw new Error("Transition produced invalid state");
      }
    }

    return currentState;
  }
}
