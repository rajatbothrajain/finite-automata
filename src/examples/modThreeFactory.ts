import { createBinaryModFSM } from "../automata/createBinaryModFSM";

const modThreeFSM = createBinaryModFSM(3);

export function modThree(input: string): number {
  return modThreeFSM.run(input);
}