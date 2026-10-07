import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_auc_score, confusion_matrix
import xgboost as xgb

try:
    from ml_engine.dataset_generator import generate_cloud_ids_dataset
except ImportError:
    from dataset_generator import generate_cloud_ids_dataset

NUMERICAL_FEATURES = [
    'duration', 'src_bytes', 'dst_bytes', 'src_pkts', 'dst_pkts',
    'pkt_len_mean', 'pkt_len_std', 'header_bytes', 'payload_entropy',
    'failed_logins', 'iam_risk_score', 'same_srv_rate', 'diff_srv_rate',
    'serror_rate', 'rerror_rate'
]

CATEGORICAL_FEATURES = ['protocol_type', 'service', 'flag', 'cloud_region']
LABEL_MAPPING = ['BENIGN', 'DoS_DDoS', 'Port_Scan', 'Brute_Force', 'Malware_C2', 'IAM_Privilege_Escalation']

def train_and_evaluate():
    data_path = 'ml_engine/data/cloud_ids_dataset.csv'
    if not os.path.exists(data_path):
        df = generate_cloud_ids_dataset()
    else:
        df = pd.read_csv(data_path)

    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df['target']

    X_train_val, X_test, y_train_val, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    X_train, X_val, y_train, y_val = train_test_split(X_train_val, y_train_val, test_size=0.20, random_state=42, stratify=y_train_val)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), NUMERICAL_FEATURES),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

    preprocessor.fit(X_train)

    X_train_trans = preprocessor.transform(X_train)
    X_val_trans = preprocessor.transform(X_val)
    X_test_trans = preprocessor.transform(X_test)

    cat_encoder = preprocessor.named_transformers_['cat']
    cat_feature_names = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES)
    all_feature_names = list(NUMERICAL_FEATURES) + list(cat_feature_names)

    models = {}
    metrics_summary = {}

    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train_trans, y_train)
    models['logistic_regression'] = lr

    rf = RandomForestClassifier(n_estimators=150, max_depth=15, random_state=42, n_jobs=-1)
    rf.fit(X_train_trans, y_train)
    models['random_forest'] = rf

    xgb_clf = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=8,
        learning_rate=0.1,
        random_state=42,
        eval_metric='mlogloss',
        n_jobs=-1
    )
    xgb_clf.fit(X_train_trans, y_train)
    models['xgboost'] = xgb_clf

    X_train_benign = X_train_trans[y_train == 0]
    iso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42, n_jobs=-1)
    iso_forest.fit(X_train_benign)
    models['isolation_forest'] = iso_forest

    for name, model in models.items():
        if name == 'isolation_forest':
            preds_raw = model.predict(X_test_trans)
            preds_binary = np.where(preds_raw == -1, 1, 0)
            y_test_binary = np.where(y_test == 0, 0, 1)
            
            acc = accuracy_score(y_test_binary, preds_binary)
            p, r, f1, _ = precision_recall_fscore_support(y_test_binary, preds_binary, average='binary')
            cm = confusion_matrix(y_test_binary, preds_binary).tolist()

            metrics_summary[name] = {
                'type': 'unsupervised_anomaly_detector',
                'accuracy': round(float(acc), 4),
                'precision': round(float(p), 4),
                'recall': round(float(r), 4),
                'f1_score': round(float(f1), 4),
                'confusion_matrix': cm
            }
        else:
            y_pred = model.predict(X_test_trans)
            y_prob = model.predict_proba(X_test_trans)
            
            acc = accuracy_score(y_test, y_pred)
            p, r, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
            roc_auc = roc_auc_score(pd.get_dummies(y_test), y_prob, multi_class='ovr', average='weighted')
            cm = confusion_matrix(y_test, y_pred).tolist()

            metrics_summary[name] = {
                'type': 'supervised_classifier',
                'accuracy': round(float(acc), 4),
                'precision': round(float(p), 4),
                'recall': round(float(r), 4),
                'f1_score': round(float(f1), 4),
                'roc_auc': round(float(roc_auc), 4),
                'confusion_matrix': cm
            }

    rf_importances = models['random_forest'].feature_importances_
    top_rf_idx = np.argsort(rf_importances)[::-1][:15]
    feature_importance_list = [
        {'feature': all_feature_names[i], 'importance': round(float(rf_importances[i]), 4)}
        for i in top_rf_idx
    ]

    models_dir = 'ml_engine/models'
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(preprocessor, os.path.join(models_dir, 'preprocessor.joblib'))
    joblib.dump(models['random_forest'], os.path.join(models_dir, 'random_forest.joblib'))
    joblib.dump(models['xgboost'], os.path.join(models_dir, 'xgboost.joblib'))
    joblib.dump(models['isolation_forest'], os.path.join(models_dir, 'isolation_forest.joblib'))
    joblib.dump(models['logistic_regression'], os.path.join(models_dir, 'logistic_regression.joblib'))

    metadata = {
        'numerical_features': NUMERICAL_FEATURES,
        'categorical_features': CATEGORICAL_FEATURES,
        'all_transformed_feature_names': all_feature_names,
        'labels': LABEL_MAPPING,
        'metrics': metrics_summary,
        'feature_importances': feature_importance_list
    }

    with open(os.path.join(models_dir, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print("Model training complete.")

if __name__ == '__main__':
    train_and_evaluate()
