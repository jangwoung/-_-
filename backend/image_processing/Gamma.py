import cv2
import numpy as np

def apply_gamma_correction(image: np.ndarray, gamma: float) -> np.ndarray:
    # ガンマ補正のテーブルを作成
    invGamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** invGamma) * 255 for i in range(256)]).astype("uint8")

    # 画像にガンマ補正を適用
    return cv2.LUT(image, table)
