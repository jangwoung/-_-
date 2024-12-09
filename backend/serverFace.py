from flask import Flask, request, send_file
import cv2
import numpy as np
import io
from flask_cors import CORS
from image_processing.face_detection import detect_faces  # インポート

app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return "No image part", 400

    file = request.files['image']
    if file.filename == '':
        return "No selected file", 400

    # 画像処理部分
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # 顔検出処理
    try:
        image = detect_faces(image)
    except RuntimeError as e:
        return str(e), 500

    # 結果をJPEG形式でエンコード
    _, buffer = cv2.imencode('.jpg', image)

    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/jpeg',
        as_attachment=False,
        download_name='processed.jpg'
    )

if __name__ == '__main__':
    app.run(debug=True)
