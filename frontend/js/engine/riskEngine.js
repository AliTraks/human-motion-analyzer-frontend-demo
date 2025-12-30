import { buffer } from "./featureEngine.js";

export function temporalACL(){
  if(buffer.length < 10) return 0;
  let trend = 0;
  for(let i=1;i<buffer.length;i++){
    trend += buffer[i].valgus - buffer[i-1].valgus;
  }
  return Math.min(100, Math.abs(trend)*5);
}
