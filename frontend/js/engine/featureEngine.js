export const WINDOW = 30;
export let buffer = [];

export function pushFeature(f){
  buffer.push(f);
  if(buffer.length > WINDOW) buffer.shift();
}
