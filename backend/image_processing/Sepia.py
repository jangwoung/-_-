import cv2
import numpy as np

def Sepia_Filter(image: np.ndarray) -> np.ndarray:
    # セピアフィルターの適用
    sepia_filter = np.array([
    [0.393, 0.769, 0.189],[0.349, 0.686, 0.168], [0.220, 0.530, 0.130]  ])



    sepia_image = cv2.transform(image, sepia_filter)
    sepia_image = np.clip(sepia_image, 0, 255)  # ピクセル値を0-255の範囲に収める

    return sepia_image
