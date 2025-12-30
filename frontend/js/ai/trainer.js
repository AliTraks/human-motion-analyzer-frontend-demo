// js/ai/trainer.js
import { createModel } from './model.js';
import * as tf from '@tensorflow/tfjs';

export async function trainModel(X_train, y_train, epochs = 50) {
    const model = createModel(X_train[0].length);
    const xs = tf.tensor2d(X_train);
    const ys = tf.tensor2d(y_train, [y_train.length, 1]);
    await model.fit(xs, ys, {
        epochs,
        batchSize: 16,
        validationSplit: 0.2,
        callbacks: tf.callbacks.earlyStopping({monitor: 'val_loss', patience: 5})
    });
    await model.save('localstorage://human-motion-model');
    return model;
}
