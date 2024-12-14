from flask import Flask, request, send_file, jsonify , send_from_directory
import cv2
import numpy as np
import io
from flask_cors import CORS
import os
import base64
from datetime import datetime

#画像処理関数のインポート
from image_processing.ExtractPerson import extract_person_and_attach_dnn  # 人物検出
from image_processing.ReduceColors import reduce_colors
from image_processing.Gamma import Gamma_Correction
from image_processing.Sepia import Sepia_Filter
from image_processing.CreateImage import Create_Image

#定義
app = Flask(__name__)
CORS(app)

############################################################################
#人物アップロード
@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return "画像がありません", 400

    file = request.files['image']
    if file.filename == '':
        return "ファイルが選択されていません", 400

    # デコード
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # 人物検出処理
    try:
        processed_image = extract_person_and_attach_dnn(image)
    except RuntimeError as e:
        return str(e), 500

    # エンコード
    _, buffer = cv2.imencode('.jpg', processed_image)

    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/jpeg',
        as_attachment=False,
        download_name='processed.jpg'
    )
#################################################################################
#受け取った画像を保存する

#受け取った画像を保存する

# 保存先ディレクトリ
UPLOAD_FOLDER = './public/images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        # リクエストから画像データを取得
        data = request.json.get('image')
        if not data:
            return jsonify({'success': False, 'error': 'No image data provided'}), 400

        # Base64デコード
        if ',' in data:
            header, encoded = data.split(',', 1)
        else:
            return jsonify({'success': False, 'error': 'Invalid image data format'}), 400

        binary_data = base64.b64decode(encoded)

        # 保存名を生成（タイムスタンプ）
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f'image_{timestamp}.jpeg'
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # ファイルを保存
        with open(file_path, 'wb') as f:
            f.write(binary_data)

        return jsonify({'success': True, 'filePath': f'/public/images/{filename}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get-latest-image', methods=['GET'])
def get_latest_image():
    try:
        # 画像ディレクトリ内のファイル一覧を取得
        files = os.listdir(UPLOAD_FOLDER)
        # 更新日時でソートし、最新のファイルを取得
        files = sorted(files, key=lambda x: os.path.getmtime(os.path.join(UPLOAD_FOLDER, x)), reverse=True)

        if files:
            latest_image_path = os.path.join('/public/images', files[0])  # 最新の画像パス
            return jsonify({'success': True, 'imagePath': latest_image_path})
        else:
            return jsonify({'success': False, 'error': 'No images found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



#################################################################################
#アニメ風変換
@app.route('/anime-style', methods=['POST'])
def anime_style():
    if 'image' not in request.files:
        return "画像がありません", 400

    file = request.files['image']
    if file.filename == '':
        return "ファイルが選択されていません", 400

    # デコード
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # 画像処理関数
    #anime_image = cv2.stylization(image, sigma_s=60, sigma_r=0.07) #スタイラス変換⇒きもい
    # 減色処理
    anime_image = reduce_colors(image)
    # ガンマ補正
    apply_gamma=Gamma_Correction(anime_image, gamma=1.8)

    # エンコード
    _, buffer = cv2.imencode('.jpg', apply_gamma)

    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/jpeg',
        as_attachment=False,
        download_name='anime_style.jpg'
    )
#########################################################################################
#セピア風変換
@app.route('/sepia-style', methods=['POST'])
def sepia_style():
    if 'image' not in request.files:
        return "画像がありません", 400

    file = request.files['image']
    if file.filename == '':
        return "ファイルが選択されていません", 400

    # デコード
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # 画像処理関数
    sepia_image = Sepia_Filter(image)

    # エンコード
    _, buffer = cv2.imencode('.jpg', sepia_image)

    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/jpeg',
        as_attachment=False,
        download_name='sepia_style.jpg'
    )
###############################################################################


#########################################################################################
#実行
if __name__ == '__main__':
    app.run(debug=True)
