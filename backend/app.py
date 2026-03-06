from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), '../data')
DASHBOARD_DIR = os.path.join(os.path.dirname(__file__), '../dashboard')

@app.route('/', methods=['GET'])
def index():
    return send_from_directory(DASHBOARD_DIR, 'index.html')

@app.route('/api/trends', methods=['GET'])
def get_trends():
    try:
        with open(os.path.join(DATA_DIR, 'regional_monthly.json'), 'r') as f:
            data = json.load(f)
        result = []
        for month, regions in data.items():
            entry = {"month": month}
            entry.update(regions)
            result.append(entry)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/national', methods=['GET'])
def get_national():
    try:
        with open(os.path.join(DATA_DIR, 'national_monthly.json'), 'r') as f:
            data = json.load(f)
        result = [{"month": k, "usage": v} for k, v in data.items()]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recovery_pct', methods=['GET'])
def get_recovery_pct():
    try:
        with open(os.path.join(DATA_DIR, 'recovery_pct.json'), 'r') as f:
            data = json.load(f)
        # Data is {Month: {Region: PctChange}}
        result = []
        for month, regions in data.items():
            entry = {"month": month}
            entry.update(regions)
            result.append(entry)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        with open(os.path.join(DATA_DIR, 'stats.json'), 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
