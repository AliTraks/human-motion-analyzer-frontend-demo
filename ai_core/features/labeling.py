import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import pickle

# بارگذاری داده‌های ورودی
df = pd.read_csv("../data/processed/dataset_v1.csv")

# انتخاب ویژگی‌ها و هدف
X = df[['knee_stress', 'hip_stress', 'ankle_stress', 'global_asymmetry']]  # ویژگی‌ها
y = df['total_joint_stress']  # هدف (میزان ریسک یا آسیب کل)

# تقسیم داده‌ها به مجموعه آموزش و تست
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# آموزش مدل Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
from sklearn.preprocessing import StandardScaler

# استانداردسازی ویژگی‌ها
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# آموزش مدل با ویژگی‌های استاندارد شده
model.fit(X_train_scaled, y_train)
y_pred = model.predict(X_test_scaled)

# محاسبه MSE
mse = mean_squared_error(y_test, y_pred)
print("MSE after scaling:", mse)

# پیش‌بینی و ارزیابی مدل
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print("MSE:", mse)

# ذخیره مدل آموزش دیده
with open("../models/trained/risk_model.pkl", "wb") as f:
    pickle.dump(model, f)
# بررسی چند نمونه از داده‌ها
print(X_train.head())  # نمایش ویژگی‌ها
print(y_train.head())  # نمایش هدف

# بررسی پیش‌بینی‌ها
print("Predictions on Test Data:", y_pred[:5])  # نمایش چند نمونه از پیش‌بینی‌ها