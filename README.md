# Binary Modulo FSM (TypeScript)

This project implements a reusable Finite State Machine (FSM) framework based on the formal 5-tuple definition of finite automata. The module is designed to be extensible and developer-friendly, enabling the construction of deterministic finite automata for a variety of use cases.

As a concrete example, the project includes:

a) A direct modThree implementation for computing the remainder of a binary number divided by three.

b) A modThreeFactory implementation that demonstrates how to generate a Mod-Three automation dynamically using createBinaryModFSM(modulus).

The architecture separates the generic FSM engine from specific configurations (such as modulo computation), allowing developers to reuse the framework to build other finite automata with minimal changes.

## Setup

- Requires Node.js `>= 24.13.1` and Yarn.

Install Yarn:

```bash
npm i -g yarn
```

```bash
yarn install
```

## Build

```bash
yarn build
```

## Run tests

```bash
yarn test
```

Watch mode:

```bash
yarn test:watch
```

Type-check only:

```bash
yarn typecheck
```

## API

### Generic FSM module

- `FiniteAutomation<State, Symbol extends string = string>` in [src/fsm/FiniteAutomation.ts](src/fsm/FiniteAutomation.ts)
- Constructor accepts `FiniteAutomationConfig<State, Symbol>` from [src/fsm/types.ts](src/fsm/types.ts)
- `run(input: string): State` executes the Deterministic Finite Automaton (DFA) and returns the final state

The abstract DFA definition used by the module is:

- `Q`: finite set of states
- `Σ`: finite alphabet
- `q0 ∈ Q`: initial state
- `F ⊆ Q`: accept/final states
- `δ: Q × Σ → Q`: transition function

### Example: 

#### modThree

- `modThree(input: string): number` in [src/examples/modThree.ts](src/examples/modThree.ts)
  - Accepts the empty string (`""`, treated as 0)
  - Throws for any character other than `0` or `1`
  - Returns remainder `0`, `1`, or `2`

#### modThreeFactory : 
- `modThree(input: string): number` in [src/examples/modThreeFactory.ts](src/examples/modThreeFactory.ts)
- `createModFSM(modulus: number)` in [src/automata/createBinaryModFSM.ts](src/automata/createBinaryModFSM.ts)
  - Builds an FSM that computes `parseInt(input, 2) mod modulus` for any positive integer modulus
  - Transition uses a single `if`-subtraction instead of `%` or a `while` loop — O(1)
  - Throws `Error` if `modulus` is not a positive integer

## Mod-three implementation notes

The DFA has three states:

- `S0` → remainder 0
- `S1` → remainder 1
- `S2` → remainder 2

Transition Function:

| State | Input `0` | Input `1` |
|-------|-----------|-----------|
| S0    | S0        | S1        |
| S1    | S2        | S0        |
| S2    | S1        | S2        |

```
δ(S0,0) = S0;  δ(S0,1) = S1
δ(S1,0) = S2;  δ(S1,1) = S0
δ(S2,0) = S1;  δ(S2,1) = S2
```
The transition is mathematically equivalent to `next = (2 × state + bit)` reducing with `if (next >= 3) next -= 3`, where `bit = 1` for input `"1"` and `0` for `"0"`.

## Alternative approach (non-FSA)

You can also compute `n mod 3` by scanning bits directly and updating a running remainder:

```
function binaryStringModulo(input: string, modulus: number): number {
  if (!Number.isInteger(modulus) || modulus <= 0) {
    throw new Error("modulus must be a positive integer");
  }

  let rem = 0;
  for (const ch of input) {
    if (ch !== "0" && ch !== "1") {
      throw new Error("input must contain only '0' and '1'");
    }

    const bit = ch.charCodeAt(0) & 1; // '0' -> 0, '1' -> 1
    rem = (rem << 1) | bit;

    // Reduce without '%' (keeps rem bounded).
    if (rem >= modulus) {
      rem -= modulus;
    }
  }

  return rem;
}

const modThreeFromBinaryString = (s: string) => binaryStringModulo(s, 3);
console.log("Value:", modThreeFromBinaryString("11000"));

```

This repository intentionally uses the DFA/FSA formulation for clarity and reusability.

## Usage

### mod-three

```
import { modThree } from "./src/examples/modThree";

modThree("1101") // => 1  (13 mod 3)
modThree("1110") // => 2  (14 mod 3)
modThree("1111") // => 0  (15 mod 3)
```

### mod-three-factory

```
import { modThree } from "./src/examples/modThreeFactory";

modThree("1101") // => 1  (13 mod 3)
modThree("1110") // => 2  (14 mod 3)
modThree("1111") // => 0  (15 mod 3)
```

### generic mod-N

```
import { createModFSM } from "./src/automata/createBinaryModFSM";

const modFive = createModFSM(5);
modFive.run("110")  // => 1  (6 mod 5)
modFive.run("1111") // => 0  (15 mod 5)

const modSeven = createModFSM(7);
modSeven.run("110") // => 6  (6 mod 7)
```

