import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error  
def train_random_forest(X_train, X_test, y_train, y_test):
    # ایجاد مدل Random Forest
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    # آموزش مدل
    model.fit(X_train, y_train)

    # پیش‌بینی روی داده‌های تست
    preds = model.predict(X_test)

    # محاسبه MSE
    mse = mean_squared_error(y_test, preds)
    print(f'Mean Squared Error: {mse}')

    # مسیر ذخیره‌سازی مدل
    model_save_path = 'ai_core/models/trained/random_forest_model.pkl'
    model_dir = os.path.dirname(model_save_path)  # گرفتن مسیر پوشه
    

    # مسیر ذخیره‌سازی
    model_save_path = 'ai_core/models/trained/random_forest_model.pkl'

    # ذخیره مدل
    joblib.dump(model, model_save_path)
    print(f"Model saved at {model_save_path}")


    
    return model, mse
