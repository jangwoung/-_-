import cv2
import numpy as np
import os

def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    # フォルダ名とファイル名の指定
    folder_name = "models"
    file_protoname = "MobileNetSSD_deploy.prototxt"
    file_modelname = "mobilenet_iter_73000.caffemodel"
    proto_path = os.path.join(folder_name, file_protoname)
    model_path = os.path.join(folder_name, file_modelname)
    
    # DNNモデルを読み込む
    net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    # Step 2: 入力画像を前処理してネットワークに入力
    height, width = image.shape[:2]
    blob = cv2.dnn.blobFromImage(image, 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    # Step 3: 人物を検出
    person_box = None
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.6:  # 確信度が60%以上の場合
            class_id = int(detections[0, 0, i, 1])
            if class_id == 15:  # クラスID15は「person（人物）」を示す
                box = detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                person_box = box.astype("int")
                break

    if person_box is None:
        print("人物が検出されませんでした。")
        return image

    x1, y1, x2, y2 = person_box

    # Step 4: 人物部分を切り取る
    person_roi = image[y1:y2, x1:x2]

    # Step 5: マスクを作成
    # 画像全体をゼロで初期化したマスク
    mask = np.zeros(image.shape[:2], dtype=np.uint8)
    
    # 画像の人物領域を白く塗ることで、マスクを作成
    mask[y1:y2, x1:x2] = 255  # 白い部分が人物領域になる
    
    # Step 6: マスクを使用して人物を切り取る
    masked_person = cv2.bitwise_and(image, image, mask=mask)

    # Step 7: 白背景を作成し、切り取った人物部分を貼り付け
    
    white_background = np.ones_like(image) * 0
    
    # 背景に人物を載せる位置
    y_offset = (white_background.shape[0] - (y2 - y1)) // 2
    x_offset = (white_background.shape[1] - (x2 - x1)) // 2
    white_background[y_offset:y_offset + (y2 - y1), x_offset:x_offset + (x2 - x1)] = masked_person[y1:y2, x1:x2]

    return white_background
