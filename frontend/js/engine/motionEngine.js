// motionEngine.js
import { calculateJointAngles, calculateDeviations } from './geometry.js';
import { predictRisk } from './predictor.js';

export async function analyzeMotion(landmarks) {
  const angles = calculateJointAngles(landmarks);
  const deviations = calculateDeviations(landmarks);

  const features = [...angles, ...deviations];
  const risk = await predictRisk(features);

  return risk;
}
