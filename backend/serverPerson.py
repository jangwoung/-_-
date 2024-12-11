from flask import Flask, request, send_file
import cv2
import numpy as np
import io
from flask_cors import CORS
from image_processing.ExtractPerson import extract_person_and_attach_dnn  # 人物検出をインポート

app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return "画像がありません", 400

    file = request.files['image']
    if file.filename == '':
        return "ファイルが選択されていません", 400

    # 画像処理部分
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # 人物検出処理
    try:
        image = extract_person_and_attach_dnn(image)  # 人物検出関数を呼び出す
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
