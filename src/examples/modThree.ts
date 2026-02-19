import { FiniteAutomation } from "../fsm/FiniteAutomation";

enum State {
  S0 = 0,
  S1 = 1,
  S2 = 2
}

type BinarySymbol = "0" | "1";

const states : State[] = [State.S0, State.S1, State.S2];
const alphabet: BinarySymbol[] = ["0", "1"];
const initialState = State.S0;

// All states are valid because we return the remainder (0, 1, or 2)
const acceptStates: State[] = states;

const transition = (state: State, symbol: BinarySymbol): State => {
  switch (state) {
    case State.S0:
      return symbol === "0" ? State.S0 : State.S1;
    case State.S1:
      return symbol === "0" ? State.S2 : State.S0;
    case State.S2:
      return symbol === "0" ? State.S1 : State.S2;
    default:
      throw new Error("Invalid state");
  }
};

const modThreeFiniteAutomation = new FiniteAutomation<State, BinarySymbol>({
  states,
  alphabet,
  initialState,
  acceptStates,
  transitionFn:transition
});

export function modThree(input: string): number {
  return modThreeFiniteAutomation.run(input);
}
