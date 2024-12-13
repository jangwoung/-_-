import cv2
import numpy as np
#OpenCV + GrabCut (軽量手法)

def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    # 画像のサイズを取得
    height, width = image.shape[:2]

    # マスクを初期化
    mask = np.zeros((height, width), np.uint8)

    # 背景と前景のモデル
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)

    # 初期の矩形領域を指定（人物の大まかな領域）
    # この部分は人物の大体の位置を指定するため、実際のアプリケーションでは動的に変更されるべきです
    rect = (10, 10, width - 10, height - 10)

    # GrabCutでセグメンテーションを実行
    cv2.grabCut(image, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)

    # セグメンテーション結果の後処理
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

    # 結果の画像を作成
    person_image = image * mask2[:, :, np.newaxis]

    # 白背景に人物を配置
    white_background = np.ones_like(image) * 0
    white_background[mask2 == 1] = person_image[mask2 == 1]

    return white_background
