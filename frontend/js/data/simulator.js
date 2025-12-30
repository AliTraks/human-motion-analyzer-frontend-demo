export function generateSample(risky=false){
  const base = risky ? 140 : 165;
  return {
    knee: base + Math.random()*10,
    hip: 160 + Math.random()*8,
    spine: 175 + Math.random()*5,
    valgus: risky ? 18+Math.random()*8 : 4+Math.random()*4,
    label: risky ? 1 : 0
  };
}

export function generateSequence(risky=false){
  let seq=[];
  for(let i=0;i<30;i++){
    seq.push(generateSample(risky));
  }
  return seq;
}