// geometry.js
export function calculateJointAngles(landmarks) {
  const leftKneeAngle = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
  const rightKneeAngle = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
  return [leftKneeAngle, rightKneeAngle];
}

export function calculateDeviations(landmarks) {
  const shoulderDeviation = Math.abs(landmarks[11].y - landmarks[12].y);
  const trunkDeviation = Math.abs(landmarks[23].y - landmarks[24].y);
  return [shoulderDeviation, trunkDeviation];
}

function calculateAngle(A, B, C) {
  const AB = { x: A.x - B.x, y: A.y - B.y };
  const BC = { x: C.x - B.x, y: C.y - B.y };
  const dot = AB.x * BC.x + AB.y * BC.y;
  const mag = Math.hypot(AB.x, AB.y) * Math.hypot(BC.x, BC.y);
  return Math.acos(dot / mag) * (180 / Math.PI);
}
