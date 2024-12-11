import cv2
import numpy as np
import os
from skimage import measure
from skimage import draw
from skimage.segmentation import active_contour

############################################################################
def segment_person_in_box_with_improvements(image: np.ndarray, person_box: tuple) -> np.ndarray:
    # 入力画像と人物の矩形領域 (person_box) を受け取り、
    # 人物領域をセグメンテーションして返す関数

    # 矩形の座標 (左上のx, y, 右下のx, y) を展開
    x1, y1, x2, y2 = person_box

    # Step 1: 矩形領域の切り出し
    # 入力画像から指定された矩形領域を抽出
    person_roi = image[y1:y2, x1:x2]

    # Step 2: グレースケール変換
    # 抽出した人物領域をグレースケール画像に変換
    gray = cv2.cvtColor(person_roi, cv2.COLOR_BGR2GRAY)

    # Step 3: ぼかし処理でノイズを低減
    # 高周波ノイズを除去するためにガウシアンフィルタを適用
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Step 4: エッジ検出（Canny法）
    # 画像内のエッジを強調して輪郭抽出を容易にする
    edges = cv2.Canny(blurred, threshold1=20, threshold2=80)

    # Step 5: エッジの拡張（モルフォロジー変換）
    # モルフォロジー処理でエッジを補強し、小さな隙間を埋める
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))  # 矩形カーネルを作成
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)   # モルフォロジー閉処理を適用

    # Step 6: 輪郭抽出
    # エッジ画像から輪郭を検出
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 検出された輪郭がない場合のエラーハンドリング
    if not contours:
        print("エッジ検出で輪郭が見つかりませんでした。")
        return person_roi  # 元のROIを返す

    # Step 7: 内部領域を塗りつぶすマスクを作成
    # 輪郭の内部を完全に塗りつぶしたマスクを作成
    mask = np.zeros_like(gray)  # 元画像と同じサイズのゼロ配列を生成
    cv2.drawContours(mask, contours, -1, 255, thickness=cv2.FILLED)  # 全ての輪郭を塗りつぶし

    # Step 8: マスクを適用して人物領域を抽出
    # マスクを使用して元の画像から対象領域を切り出す
    segmented_person = cv2.bitwise_and(person_roi, person_roi, mask=mask)

    # モルフォロジー収縮を適用して、領域を縮小する
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))  # 1x1の矩形カーネル
    mask = cv2.morphologyEx(mask, cv2.MORPH_ERODE, kernel)

    # セグメント化された人物領域とマスクを返す
    return segmented_person, mask











def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    import cv2
    import numpy as np
    import os

    # モデルファイルの指定
    folder_name = "models"
    proto_path = os.path.join(folder_name, "MobileNetSSD_deploy.prototxt")
    model_path = os.path.join(folder_name, "mobilenet_iter_73000.caffemodel")
    
    # モデルの存在チェック
    if not os.path.exists(proto_path) or not os.path.exists(model_path):
        raise FileNotFoundError("必要なモデルファイルが見つかりません。")

    # DNNモデルを読み込む
    net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    # 入力画像の前処理
    height, width = image.shape[:2]
    blob = cv2.dnn.blobFromImage(image, 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    # 人物検出
    person_box = None
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.6:  # 確信度が60%以上の場合
            class_id = int(detections[0, 0, i, 1])
            if class_id == 15:  # クラスID15は「person（人物）」
                box = detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                person_box = box.astype("int")
                break

    if person_box is None:
        print("人物が検出されませんでした。")
        return image

    # セグメント処理とマスクの取得
    segmented_person, mask = segment_person_in_box_with_improvements(image, person_box)

    # 背景画像の読み込み
    Public_name = "public"
    background_path = os.path.join(Public_name, "kyoto.jpg")
    background = cv2.imread(background_path)
    if background is None:
        raise FileNotFoundError(f"背景画像 {background_path} が見つかりません。")

    # 背景画像をリサイズして入力画像と同じサイズに
    background = cv2.resize(background, (image.shape[1], image.shape[0]))

    # 切り抜いた人物の高さを一定にリサイズ
    target_height = int(height * 0.8)  # 背景の80%の高さに揃える
    person_h, person_w = segmented_person.shape[:2]
    scale = target_height / person_h
    resized_person = cv2.resize(segmented_person, (int(person_w * scale), target_height))
    resized_mask = cv2.resize(mask, (int(person_w * scale), target_height), interpolation=cv2.INTER_NEAREST)

    # 背景中心に人物を配置
    person_h, person_w = resized_person.shape[:2]
    offset_x = (width - person_w) // 2
    offset_y = (height - target_height) // 2 + int(height * 0.1)  # Y方向に下寄り

    # マスクと人物画像を背景に貼り付け
    full_mask = np.zeros((height, width), dtype=np.uint8)
    full_mask[offset_y:offset_y + person_h, offset_x:offset_x + person_w] = resized_mask

    full_person = np.zeros_like(image)
    full_person[offset_y:offset_y + person_h, offset_x:offset_x + person_w] = resized_person

    # 背景と合成
    inverted_mask = cv2.bitwise_not(full_mask)  # マスクの反転
    background_part = cv2.bitwise_and(background, background, mask=inverted_mask)
    person_part = cv2.bitwise_and(full_person, full_person, mask=full_mask)

    combined = cv2.add(background_part, person_part)
    return combined






