import { FiniteAutomation } from "../src/fsm/FiniteAutomation";

describe("FiniteAutomation", () => {
  test("throws on empty states", () => {
    expect(() =>
      new FiniteAutomation({
        states: [],
        alphabet: ["a"],
        initialState: "a",
        acceptStates: [],
        transitionFn: () => "a"
      })
    ).toThrow("States must be a non-empty array.");
  });

  test("throws on empty alphabet", () => {
    expect(() =>
      new FiniteAutomation({
        states: [0],
        alphabet: [],
        initialState: 0,
        acceptStates: [0],
        transitionFn: () => 0
      })
    ).toThrow("Alphabet must be a non-empty array.");
  });

  test("throws if initial state is not in states", () => {
    expect(() =>
      new FiniteAutomation({
        states: [0],
        alphabet: ["a"],
        initialState: 1,
        acceptStates: [0],
        transitionFn: () => 0
      })
    ).toThrow("Initial state must be one of the defined states.");
  });

  test("throws if accept state is not in states", () => {
    expect(() =>
      new FiniteAutomation({
        states: [0],
        alphabet: ["a"],
        initialState: 0,
        acceptStates: [1],
        transitionFn: () => 0
      })
    ).toThrow("Accept state must be one of the defined states.");
  });

    test("throws on invalid symbol", () => {
    const fsm = new FiniteAutomation({
      states: [0],
      alphabet: ["a"],
      initialState: 0,
      acceptStates: [0],
      transitionFn: () => 0
    });

    expect(() => fsm.run("b")).toThrow(/Invalid symbol/i);
  });

  test("throws if transition produces invalid state", () => {
    const fsm = new FiniteAutomation({
      states: [0],
      alphabet: ["a"],
      initialState: 0,
      acceptStates: [0],
      transitionFn: () => 1
    });

    expect(() => fsm.run("a")).toThrow("Transition produced invalid state");
  });

});
