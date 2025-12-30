import pandas as pd
import numpy as np

# ---------------------------
# CONFIG
# ---------------------------
WINDOW_SIZE = 5   # برای محاسبه سرعت و شتاب
EPS = 1e-6        # جلوگیری از تقسیم بر صفر


# ---------------------------
# LOAD DATA
# ---------------------------
def load_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df = df.dropna().reset_index(drop=True)
    return df


# ---------------------------
# BASIC FEATURES
# ---------------------------
def symmetry(left: pd.Series, right: pd.Series) -> pd.Series:
    """
    عدم تقارن بین چپ و راست
    """
    return abs(left - right)


def mean_angle(left: pd.Series, right: pd.Series) -> pd.Series:
    """
    میانگین زاویه مفصل
    """
    return (left + right) / 2


# ---------------------------
# DYNAMIC FEATURES
# ---------------------------
def angular_velocity(series: pd.Series) -> pd.Series:
    """
    سرعت تغییر زاویه
    """
    return series.diff().rolling(WINDOW_SIZE).mean()


def angular_acceleration(series: pd.Series) -> pd.Series:
    """
    شتاب تغییر زاویه
    """
    return series.diff().diff().rolling(WINDOW_SIZE).mean()


# ---------------------------
# STRESS INDEX
# ---------------------------
def joint_stress(angle_mean, velocity, acceleration) -> pd.Series:
    """
    شاخص فشار مفصل (کاملاً قابل دفاع علمی)
    """
    stress = (
        0.5 * abs(angle_mean) +
        0.3 * abs(velocity) +
        0.2 * abs(acceleration)
    )
    return stress


# ---------------------------
# MAIN FEATURE PIPELINE
# ---------------------------
def build_features(df: pd.DataFrame) -> pd.DataFrame:

    features = pd.DataFrame()

    # ---- KNEE ----
    features['knee_symmetry'] = symmetry(df['knee_L'], df['knee_R'])
    features['knee_mean'] = mean_angle(df['knee_L'], df['knee_R'])

    features['knee_velocity'] = angular_velocity(features['knee_mean'])
    features['knee_acceleration'] = angular_acceleration(features['knee_mean'])

    features['knee_stress'] = joint_stress(
        features['knee_mean'],
        features['knee_velocity'],
        features['knee_acceleration']
    )

    # ---- HIP ----
    features['hip_symmetry'] = symmetry(df['hip_L'], df['hip_R'])
    features['hip_mean'] = mean_angle(df['hip_L'], df['hip_R'])

    features['hip_velocity'] = angular_velocity(features['hip_mean'])
    features['hip_acceleration'] = angular_acceleration(features['hip_mean'])

    features['hip_stress'] = joint_stress(
        features['hip_mean'],
        features['hip_velocity'],
        features['hip_acceleration']
    )

    # ---- ANKLE ----
    features['ankle_symmetry'] = symmetry(df['ankle_L'], df['ankle_R'])
    features['ankle_mean'] = mean_angle(df['ankle_L'], df['ankle_R'])

    features['ankle_velocity'] = angular_velocity(features['ankle_mean'])
    features['ankle_acceleration'] = angular_acceleration(features['ankle_mean'])

    features['ankle_stress'] = joint_stress(
        features['ankle_mean'],
        features['ankle_velocity'],
        features['ankle_acceleration']
    )

    # ---- GLOBAL FEATURES ----
    features['total_joint_stress'] = (
        features['knee_stress'] +
        features['hip_stress'] +
        features['ankle_stress']
    )

    features['global_asymmetry'] = (
        features['knee_symmetry'] +
        features['hip_symmetry'] +
        features['ankle_symmetry']
    )

    # پاکسازی نهایی
    features = features.fillna(0)

    return features


# ---------------------------
# SAVE DATASET
# ---------------------------
def save_features(features: pd.DataFrame, out_path: str):
    features.to_csv(out_path, index=False)


# ---------------------------
# CLI USAGE
# ---------------------------
if __name__ == "__main__":
    input_csv = "../data/raw/session_001.csv"
    output_csv = "../data/processed/dataset_v1.csv"

    df_raw = load_data(input_csv)
    df_features = build_features(df_raw)
    save_features(df_features, output_csv)

    print("✅ Feature engineering completed successfully.")
    print("📁 Saved to:", output_csv)
