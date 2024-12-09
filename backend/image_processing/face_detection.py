import cv2
import numpy as np

def detect_faces(image: np.ndarray) -> np.ndarray:
    """
    顔検出を行い、検出された顔に矩形を描画する。

    :param image: OpenCV形式の画像データ
    :return: 顔に矩形が描画された画像データ
    """
    # カスケード分類器の読み込み
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    
    if face_cascade.empty():
        raise RuntimeError("顔検出用のカスケード分類器が見つかりません。")

    # グレースケールに変換（顔検出用）
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 顔検出
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # 顔に矩形を描画
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 3)

    return image
