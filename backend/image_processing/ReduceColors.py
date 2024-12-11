import cv2
import numpy as np

def reduce_colors(image: np.ndarray, num_colors: int = 4) -> np.ndarray:
    # 画像のデータ型をfloat32に変換
    img = np.float32(image) / 255.0

    # 色数の分布に基づいて各色のクォンタイズを行う
    step = 1.0 / num_colors
    img = np.floor(img / step) * step  # 色数を減らす処理

    # 画像を元の形式に戻す（0-255の範囲）
    img = np.uint8(img * 255)

    return img
