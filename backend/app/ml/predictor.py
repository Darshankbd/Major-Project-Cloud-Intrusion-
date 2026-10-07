import os
import json
import joblib
import numpy as np
import pandas as pd
from backend.app.config import settings

class MLPredictor:
    def __init__(self):
        self.preprocessor = None
        self.rf_model = None
        self.xgb_model = None
        self.iso_forest = None
        self.metadata = None
        self.is_loaded = False
        self.load_models()

    def load_models(self):
        model_dir = settings.MODEL_DIR
        try:
            preprocessor_path = os.path.join(model_dir, "preprocessor.joblib")
            rf_path = os.path.join(model_dir, "random_forest.joblib")
            xgb_path = os.path.join(model_dir, "xgboost.joblib")
            iso_path = os.path.join(model_dir, "isolation_forest.joblib")
            meta_path = os.path.join(model_dir, "metadata.json")

            if not os.path.exists(meta_path):
                print("Models not found. Training pipeline will be triggered.")
                return

            self.preprocessor = joblib.load(preprocessor_path)
            self.rf_model = joblib.load(rf_path)
            self.xgb_model = joblib.load(xgb_path)
            self.iso_forest = joblib.load(iso_path)

            with open(meta_path, 'r') as f:
                self.metadata = json.load(f)

            self.is_loaded = True
            print("All ML models successfully loaded into predictor service.")
        except Exception as e:
            print(f"Error loading ML models: {e}")
            self.is_loaded = False

    def predict_flow(self, flow_data: dict) -> dict:
        if not self.is_loaded:
            self.load_models()
            if not self.is_loaded:
                raise RuntimeError("ML Models are not trained or available.")

        labels = self.metadata['labels']

        df_input = pd.DataFrame([flow_data])
        X_trans = self.preprocessor.transform(df_input)

        xgb_probs = self.xgb_model.predict_proba(X_trans)[0]
        rf_probs = self.rf_model.predict_proba(X_trans)[0]

        ensemble_probs = (xgb_probs * 0.6) + (rf_probs * 0.4)
        pred_class_idx = int(np.argmax(ensemble_probs))
        confidence = float(ensemble_probs[pred_class_idx])
        pred_label = labels[pred_class_idx]

        iso_score_raw = float(self.iso_forest.decision_function(X_trans)[0])
        anomaly_score = round(float(np.clip(1.0 - (iso_score_raw + 0.5), 0.0, 1.0)), 4)
        is_anomaly = bool(anomaly_score > 0.60 or self.iso_forest.predict(X_trans)[0] == -1)

        if pred_label == 'BENIGN' and not is_anomaly:
            severity = 'LOW'
            risk_score = round(float(1.0 - confidence), 4)
        else:
            risk_score = round(float(confidence * 0.85 + anomaly_score * 0.15), 4)
            if risk_score >= settings.RISK_THRESHOLD_CRITICAL or pred_label in ['DoS_DDoS', 'IAM_Privilege_Escalation']:
                severity = 'CRITICAL'
            elif risk_score >= settings.RISK_THRESHOLD_HIGH or pred_label in ['Brute_Force', 'Malware_C2']:
                severity = 'HIGH'
            elif risk_score >= settings.RISK_THRESHOLD_MEDIUM:
                severity = 'MEDIUM'
            else:
                severity = 'LOW'

        rf_importances = self.rf_model.feature_importances_
        all_feat_names = self.metadata['all_transformed_feature_names']
        
        sample_vals = X_trans[0]
        feature_contributions = []

        for i, val in enumerate(sample_vals):
            name = all_feat_names[i]
            contrib = abs(val) * rf_importances[i]
            if contrib > 0.005:
                feature_contributions.append({
                    'feature': name,
                    'value': round(float(val), 3),
                    'contribution_score': round(float(contrib), 4)
                })

        feature_contributions = sorted(feature_contributions, key=lambda x: x['contribution_score'], reverse=True)[:5]
        probabilities_dict = {labels[i]: round(float(ensemble_probs[i]), 4) for i in range(len(labels))}

        return {
            'prediction': pred_label,
            'prediction_idx': pred_class_idx,
            'confidence': round(confidence, 4),
            'severity': severity,
            'risk_score': risk_score,
            'anomaly_score': anomaly_score,
            'is_zero_day_anomaly': is_anomaly,
            'probabilities': probabilities_dict,
            'top_feature_contributions': feature_contributions
        }

    def predict_batch(self, flow_list: list) -> list:
        results = []
        for flow in flow_list:
            results.append(self.predict_flow(flow))
        return results

predictor_service = MLPredictor()
