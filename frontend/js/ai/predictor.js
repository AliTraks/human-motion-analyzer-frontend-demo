// predictor.js
import { loadOrCreateModel } from './model.js';

export async function predictRisk(features) {
  const model = await loadOrCreateModel();
  const risk = model.predict(tf.tensor([features])).dataSync()[0];
  return risk;
}
