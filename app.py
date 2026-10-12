"""
Bio3D Anatomia - Comprehensive 3D Human Anatomy Segmented Atlas
Flask Backend Application
"""

import os
import json
import io
import time
import mimetypes
from flask import Flask, render_template, jsonify, request, send_file

# Import all 78+ anatomical organs and quiz questions from the dedicated dataset
from anatomy_data import ANATOMY_DATA, QUIZ_DATA, ORGAN_SYSTEMS

mimetypes.add_type('model/gltf-binary', '.glb')
mimetypes.add_type('model/gltf+json', '.gltf')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static'),
    static_url_path='/static'
)

@app.route('/favicon.ico')
def favicon():
    return ('', 204)

@app.route('/')
def index():
    return render_template('index.html', organs=ANATOMY_DATA, systems=ORGAN_SYSTEMS)

@app.route('/api/organs')
def get_organs():
    return jsonify({
        "status": "success",
        "total": len(ANATOMY_DATA),
        "data": ANATOMY_DATA,
        "systems": ORGAN_SYSTEMS
    })

@app.route('/api/organ/<organ_id>')
def get_organ(organ_id):
    organ = ANATOMY_DATA.get(organ_id)
    if not organ:
        return jsonify({"status": "error", "message": f"Organ '{organ_id}' not found"}), 404
    return jsonify({
        "status": "success",
        "data": organ
    })

@app.route('/api/quiz')
def get_quiz():
    return jsonify({
        "status": "success",
        "questions": QUIZ_DATA
    })

@app.route('/api/search')
def search_anatomy():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify({"results": []})
    
    results = []
    for organ_id, organ in ANATOMY_DATA.items():
        # Match organ name, overview, system
        if query in organ['name'].lower() or query in organ.get('overview', '').lower() or query in organ.get('system', '').lower():
            results.append({
                "type": "organ",
                "organ_id": organ_id,
                "title": organ['name'],
                "subtitle": organ.get('system', ''),
                "icon": organ.get('icon', '🔬'),
                "segment_id": None
            })
        
        # Match individual segments
        for seg in organ.get('segments', []):
            if query in seg['name'].lower() or query in seg.get('function', '').lower() or query in seg.get('pathology', '').lower():
                results.append({
                    "type": "segment",
                    "organ_id": organ_id,
                    "title": seg['name'],
                    "subtitle": f"{organ['name']} • {seg.get('function', '')[:60]}...",
                    "icon": organ.get('icon', '🔬'),
                    "segment_id": seg['id']
                })
    
    return jsonify({"results": results[:20]})

if __name__ == '__main__':
    print(f"[Bio3D Nexus] Loaded {len(ANATOMY_DATA)} anatomical entries across {len(ORGAN_SYSTEMS)} systems.")
    print("[Bio3D Nexus] Server running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
