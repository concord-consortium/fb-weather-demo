export function normalize(minIn:number, maxIn:number, minOut:number, maxOut:number, input:number) {
  let d = maxIn  - minIn;
  let r = maxOut - minOut;
  return ((input - minIn) / d) * r + minOut;
}
