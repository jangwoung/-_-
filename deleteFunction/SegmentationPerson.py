import cv2
import numpy as np
import os

def semantic_segmentation_person(image: np.ndarray) -> np.ndarray:
    """
    DeepLabv3モデルを使用して人物をセマンティックセグメンテーション
    """
    # モデルファイルのパス
    model_folder = "models"
    model_path = os.path.join(model_folder, "deeplabv3_mobilenet_v3_large.pb")
    config_path = os.path.join(model_folder, "deeplabv3_mobilenet_v3_large.pbtxt")
    
    # モデルの読み込み
    net = cv2.dnn.readNetFromTensorflow(model_path, config_path)
    
    # 画像の前処理
    blob = cv2.dnn.blobFromImage(
        image, 
        scalefactor=1.0/127.5, 
        size=(513, 513), 
        mean=(127.5, 127.5, 127.5), 
        swapRB=True, 
        crop=False
    )
    net.setInput(blob)
    
    # セグメンテーションの実行
    output = net.forward()
    output = output[0, :, :, :]
    
    # セグメンテーション結果の後処理
    output_resized = cv2.resize(output.argmax(axis=0).astype(np.uint8), 
                                (image.shape[1], image.shape[0]))
    
    # クラス15が人物（COCOデータセットの場合）
    person_mask = (output_resized == 15).astype(np.uint8) * 255
    
    # マスクを使用して人物を抽出
    masked_person = cv2.bitwise_and(image, image, mask=person_mask)
    
    # 白背景に人物を配置
    white_background = np.ones_like(image) * 255
    white_background[person_mask > 0] = masked_person[person_mask > 0]
    
    return white_background
