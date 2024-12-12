from flask import Flask, request, send_file
import cv2
import numpy as np
import io
from flask_cors import CORS

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

    #デコード
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # 人物検出処理
    try:
        image = extract_person_and_attach_dnn(image)  # 人物検出関数を呼び出す
    except RuntimeError as e:
        return str(e), 500

    #エンコード
    _, buffer = cv2.imencode('.jpg', image)

    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/jpeg',
        as_attachment=False,
        download_name='processed.jpg'
    )
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
