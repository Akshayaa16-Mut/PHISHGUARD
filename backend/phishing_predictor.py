from urllib.parse import urlparse
from collections import Counter
import ipaddress
import math
import pandas as pd
import joblib


model = joblib.load("phishing_url_model.pkl")
deployment_features = joblib.load("deployment_features.pkl")


suspicious_keywords = [
    "login",
    "verify",
    "secure",
    "account",
    "update",
    "bank",
    "signin",
    "password",
    "confirm",
    "payment"
]


def calculate_url_entropy(url):
    url = str(url)

    if len(url) == 0:
        return 0.0

    probabilities = [
        count / len(url)
        for count in Counter(url).values()
    ]

    return -sum(
        probability * math.log2(probability)
        for probability in probabilities
    )


def extract_features(url):
    url = str(url)

    parsed_url = urlparse(url)

    domain = parsed_url.netloc

    try:
        ipaddress.ip_address(domain)
        is_domain_ip = 1

    except ValueError:
        is_domain_ip = 0

    domain_parts = domain.split(".")

    tld = (
        domain_parts[-1]
        if len(domain_parts) > 1
        else ""
    )

    no_of_subdomains = max(
        len(domain_parts) - 2,
        0
    )

    suspicious_count = sum(
        keyword in url.lower()
        for keyword in suspicious_keywords
    )

    special_char_count = sum(
        not char.isalnum()
        for char in url
    )

    features = {
        "DomainLength": len(domain),

        "TLDLength": len(tld),

        "IsDomainIP": is_domain_ip,

        "NoOfSubDomain": no_of_subdomains,

        "HasObfuscation": int("%" in url),

        "SuspiciousKeywordCount": suspicious_count,

        "NoOfDegitsInURL": sum(
            char.isdigit()
            for char in url
        ),

        "NoOfEqualsInURL": url.count("="),

        "NoOfQMarkInURL": url.count("?"),

        "IsHTTPS": int(
            parsed_url.scheme.lower() == "https"
        ),

        "DotCount": url.count("."),

        "HyphenCount": url.count("-"),

        "DigitCount": sum(
            char.isdigit()
            for char in url
        ),

        "SpecialCharCount": special_char_count,

        "PathLength": len(parsed_url.path),

        "QueryLength": len(parsed_url.query),

        "URLEntropy": calculate_url_entropy(url)
    }

    return pd.DataFrame(
        [features],
        columns=deployment_features
    )


def analyze_url(url):
    url = str(url)

    parsed_url = urlparse(url)

    features = extract_features(url)

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    phishing_index = list(
        model.classes_
    ).index(0)

    phishing_risk = float(
        probabilities[phishing_index] * 100
    )
    model_confidence = float(
    max(probabilities) * 100
    )

    if prediction == 0:
        result = "Phishing URL"

    else:
        result = "Legitimate URL"

    if phishing_risk < 30:
        risk_level = "Low Risk"

    elif phishing_risk < 70:
        risk_level = "Medium Risk"

    else:
        risk_level = "High Risk"

    feature_values = features.iloc[0].to_dict()

    risk_indicators = []

    if int(feature_values["IsHTTPS"]) == 0:
        risk_indicators.append({
            "Indicator": "HTTPS NOT USED",
            "Value": "NO HTTPS",
            "Severity": "High"
        })

    if int(
        feature_values["SuspiciousKeywordCount"]
    ) > 0:

        risk_indicators.append({
            "Indicator": "SUSPICIOUS KEYWORDS",
            "Value": int(
                feature_values[
                    "SuspiciousKeywordCount"
                ]
            ),
            "Severity": "High"
        })

    if int(feature_values["HyphenCount"]) >= 2:
        risk_indicators.append({
            "Indicator": "MULTIPLE HYPHENS",
            "Value": int(
                feature_values["HyphenCount"]
            ),
            "Severity": "Medium"
        })

    if int(feature_values["NoOfSubDomain"]) >= 2:
        risk_indicators.append({
            "Indicator": "MULTIPLE SUBDOMAINS",
            "Value": int(
                feature_values["NoOfSubDomain"]
            ),
            "Severity": "Medium"
        })

    if int(feature_values["IsDomainIP"]) == 1:
        risk_indicators.append({
            "Indicator": "IP-BASED DOMAIN",
            "Value": "DETECTED",
            "Severity": "High"
        })

    if int(feature_values["HasObfuscation"]) == 1:
        risk_indicators.append({
            "Indicator": "URL OBFUSCATION",
            "Value": "DETECTED",
            "Severity": "High"
        })

    if float(feature_values["URLEntropy"]) > 4.5:
        risk_indicators.append({
            "Indicator": "HIGH URL ENTROPY",
            "Value": round(
                float(
                    feature_values["URLEntropy"]
                ),
                2
            ),
            "Severity": "Medium"
        })

    if len(risk_indicators) == 0:
        risk_indicators.append({
            "Indicator": "NO STRONG URL INDICATORS",
            "Value": "CLEAR",
            "Severity": "Low"
        })

    security_recommendations = []

    if prediction == 0:
        security_recommendations.append({
            "Title": "AVOID THIS URL",
            "Message": (
                "Do not open or interact with this URL."
            )
        })

        security_recommendations.append({
            "Title": "DO NOT ENTER CREDENTIALS",
            "Message": (
                "Never enter passwords, banking details, "
                "or personal information."
            )
        })

        security_recommendations.append({
            "Title": "VERIFY THE SOURCE",
            "Message": (
                "Check the official domain before continuing."
            )
        })

    else:
        security_recommendations.append({
            "Title": "NO STRONG PHISHING PREDICTION",
            "Message": (
                "The model did not detect strong phishing "
                "characteristics in this URL."
            )
        })

        security_recommendations.append({
            "Title": "VERIFY UNEXPECTED LINKS",
            "Message": (
                "Stay cautious with links received from "
                "unknown or unexpected sources."
            )
        })

        security_recommendations.append({
            "Title": "PROTECT SENSITIVE INFORMATION",
            "Message": (
                "Verify the domain before entering passwords "
                "or other sensitive information."
            )
        })

    url_overview = {
        "Domain": parsed_url.netloc,

        "Protocol": (
            parsed_url.scheme.upper()
            if parsed_url.scheme
            else "UNKNOWN"
        ),

        "URL Length": len(url),

        "Domain Length": int(
            feature_values["DomainLength"]
        ),

        "Subdomains": int(
            feature_values["NoOfSubDomain"]
        ),

        "Domain Is IP": (
            "YES"
            if int(
                feature_values["IsDomainIP"]
            ) == 1
            else "NO"
        ),

        "HTTPS": (
            "YES"
            if int(
                feature_values["IsHTTPS"]
            ) == 1
            else "NO"
        ),

        "Suspicious Keywords": int(
            feature_values[
                "SuspiciousKeywordCount"
            ]
        ),

        "Hyphen Count": int(
            feature_values["HyphenCount"]
        ),

        "Special Characters": int(
            feature_values["SpecialCharCount"]
        ),

        "URL Entropy": round(
            float(
                feature_values["URLEntropy"]
            ),
            2
        )
    }

    return {
        "URL": url,

        "Prediction": result,

        "Phishing Risk Score": round(
            phishing_risk,
            2
        ),
        "Model Confidence": round(
            model_confidence,
             2
        ),

        "Risk Level": risk_level,

        "URL Overview": url_overview,

        "Risk Indicators": risk_indicators,

        "Security Recommendations": security_recommendations
    }