import os

class Settings:
    PROJECT_NAME: str = "Cloud Intrusion Detection System"
    VERSION: str = "2.5.0"
    API_V1_STR: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    MODEL_DIR: str = os.path.join(BASE_DIR, "ml_engine", "models")
    DATASET_PATH: str = os.path.join(BASE_DIR, "ml_engine", "data", "cloud_ids_dataset.csv")

    RISK_THRESHOLD_CRITICAL: float = 0.85
    RISK_THRESHOLD_HIGH: float = 0.65
    RISK_THRESHOLD_MEDIUM: float = 0.40

settings = Settings()
