from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json

    text = data["text"]
    source = data["source"]
    target = data["target"]

    translated = GoogleTranslator(
        source=source,
        target=target
    ).translate(text)

    return jsonify({"translated": translated})

if __name__ == "__main__":
    app.run(debug=True)