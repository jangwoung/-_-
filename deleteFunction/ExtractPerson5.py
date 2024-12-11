import numpy as np
import cv2
from segmentation_models import Unet
from segmentation_models import get_preprocessing
from tensorflow.keras import layers, models
from tensorflow.keras.models import Sequential

# MobileNetV2バックボーンを使ったU-Netのモデルを定義
def create_model():
    model = Unet(backbone_name='mobilenetv2', encoder_weights='imagenet', classes=1, activation='sigmoid')
    return model

# モデルのロード
model = create_model()

# 前処理用関数を取得
preprocess_input = get_preprocessing('mobilenetv2')

# 画像の前処理
def preprocess_image(image: np.ndarray) -> np.ndarray:
    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # BGRからRGBに変換
    img = cv2.resize(img, (256, 256))  # モデルに合ったサイズにリサイズ
    img = preprocess_input(img)  # 前処理
    img = np.expand_dims(img, axis=0)  # バッチ次元を追加
    return img

# セグメンテーションの実行
def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    img = preprocess_image(image)
    pred_mask = model.predict(img)  # 予測
    pred_mask = pred_mask.squeeze()  # バッチ次元を削除
    pred_mask = (pred_mask > 0.5).astype(np.uint8)  # 0.5以上を1、それ以外を0に

    # 人物のマスクを取得
    person_mask = pred_mask

    # 人物画像を切り出し
    person_image = np.zeros_like(image)
    person_image[person_mask == 1] = image[person_mask == 1]

    # 白背景に人物を配置
    white_background = np.ones_like(image) * 255
    white_background[person_mask == 1] = person_image[person_mask == 1]

    return white_background
