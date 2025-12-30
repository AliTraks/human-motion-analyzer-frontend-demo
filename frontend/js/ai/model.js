// js/ai/model.js
import * as tf from '@tensorflow/tfjs';

export function createModel(inputSize = 10) {
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [inputSize], units: 32, activation: 'relu'}));
    model.add(tf.layers.dense({units: 16, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // خروجی: 0 تا 1
    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mse']
    });
    return model;
}
