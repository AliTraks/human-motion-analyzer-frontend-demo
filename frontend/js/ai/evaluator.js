// js/ai/evaluator.js
import * as tf from '@tensorflow/tfjs';

export async function evaluateModel(model, X_test, y_test) {
    const xs = tf.tensor2d(X_test);
    const ys = tf.tensor2d(y_test, [y_test.length, 1]);
    const result = model.evaluate(xs, ys);
    const loss = (await result[0].data())[0];
    const mse = (await result[1].data())[0];
    console.log(`Test Loss: ${loss}, MSE: ${mse}`);
    return {loss, mse};
}
