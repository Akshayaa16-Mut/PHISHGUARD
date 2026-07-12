**PHISHGUARD**

**Machine Learning-Based Phishing URL Detection System**

PHISHGUARD is a cybersecurity web application that detects whether a user-entered URL is **Legitimate** or **Phishing** using a **Random Forest Machine Learning model**. The system extracts deployment-safe URL features, predicts phishing risk, and provides security recommendations through an interactive web interface.

 Project Overview

The objective of PHISHGUARD is to help users identify suspicious URLs before visiting them. The system analyzes URL characteristics instead of relying only on blacklists, making it suitable for detecting previously unseen phishing URLs.

Features

- Detects phishing and legitimate URLs
- Random Forest Machine Learning model
- 17 deployment-safe URL features
- Phishing Risk Score
- Risk Level Classification
- URL Overview
- Risk Indicators
- Security Recommendations
- React + Flask web application
- Live deployment

** Technologies Used**

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Scikit-learn
- Random Forest
- Pandas
- NumPy
- Joblib

### Deployment
- GitHub
- Vercel
- Render

## Dataset

- **Dataset:** PhiUSIIL Phishing URL Dataset (UCI Repository)
- **Dataset Size:** 235,795 URLs
- Contains both legitimate and phishing URLs.

##  Machine Learning Model

### Models Compared
- Logistic Regression
- Decision Tree
- Random Forest

### Final Model
- Random Forest Classifier
- Accuracy: **99.56%**

**Workflow**

1. Dataset Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Training
5. Model Evaluation
6. Flask Backend Development
7. React Frontend Development
8. Deployment

**Applications**

- Cybersecurity awareness
- URL phishing detection
- Educational projects
- Machine Learning portfolio
- Academic research

**⚠️ Limitations**

- Detects phishing using URL-based features only.
- Some legitimate websites may occasionally be classified as phishing (false positives).
- Does not analyze webpage content, SSL certificates, or domain reputation.
- Predictions should be used as decision support and not as a guarantee of website safety.

** Future Improvements**

- Improve URL normalization
- Better handling of HTTP/HTTPS
- Improve handling of `www` and non-`www` URLs
- Integrate domain reputation services
- Browser extension support
- Real-time threat intelligence

Author

**Akshaya A**

B.Tech Computer Science and Engineering

Carmel College of Engineering and Technology (CCET)


**License**

This project is developed for educational and academic purposes.
