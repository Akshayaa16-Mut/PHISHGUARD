
from flask import Flask, request, jsonify
from flask_cors import CORS
from phishing_predictor import analyze_url

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Phishing URL Detection API is running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({
            "error": "URL is required"
        }), 400

    url = data["url"]

    try:
        result = analyze_url(url)

        return jsonify(result)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
