import cv2
import numpy as np
import os
from skimage import measure
from skimage import draw
from skimage.segmentation import active_contour
import random

############################################################################
def segment_person_in_box_with_improvements(image: np.ndarray, person_box: tuple) -> tuple:
    x1, y1, x2, y2 = person_box

    person_roi = image[y1:y2, x1:x2]
    gray = cv2.cvtColor(person_roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, threshold1=20, threshold2=80)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("エッジ検出で輪郭が見つかりませんでした。")
        return person_roi, np.zeros_like(gray)

    mask = np.zeros_like(gray)
    cv2.drawContours(mask, contours, -1, 255, thickness=cv2.FILLED)

    segmented_person = cv2.bitwise_and(person_roi, person_roi, mask=mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    mask = cv2.morphologyEx(mask, cv2.MORPH_ERODE, kernel)

    return segmented_person, mask

def segment_person(image: np.ndarray, person_box: tuple) -> tuple:
    x1, y1, x2, y2 = person_box

    # 人物領域の切り出し
    person_roi = image[y1:y2, x1:x2]
    
    # 1チャンネルの白いマスクを作成
    mask = np.ones((person_roi.shape[0], person_roi.shape[1]), dtype=np.uint8) * 255  # 白いマスク

    return person_roi, mask

file_names = [
    {"file": "ブルーウィングもじ02.jpg", "name": "ブルーウィング"},
    {"file": "牡鹿鍾乳洞01.jpg", "name": "牡鹿鍾乳洞"},
    {"file": "関門海峡ミュージアム01.jpg", "name": "関門海峡ミュージアム"},
    {"file": "旧門司三井倶楽部01.jpg", "name": "旧門司三井倶楽部"},
    {"file": "皿倉山夜景05.jpg", "name": "皿倉山夜景"},
    {"file": "若戸大橋ライトアップ09.jpg", "name": "若戸大橋ライトアップ"},
    {"file": "小倉城ライトアップ.jpg", "name": "小倉城ライトアップ"},
    {"file": "小倉発祥焼うどん.jpg", "name": "小倉発祥焼うどん"},
    {"file": "千仏鍾乳洞02.jpg", "name": "千仏鍾乳洞"},
    {"file": "平尾台04.jpg", "name": "平尾台"},
    {"file": "北九州市立美術館本館０１.jpg", "name": "北九州市立美術館本館"},
    {"file": "門司港レトロ夜景01.jpg", "name": "門司港レトロ夜景"},
    {"file": "門司港発祥焼きカレー.jpg", "name": "門司港発祥焼きカレー"}
]

# ランダムにファイル名だけを抽出する関数
def get_random_file_name():
    random_item = random.choice(file_names)
    return random_item


def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    folder_name = "models"
    proto_path = os.path.join(folder_name, "MobileNetSSD_deploy.prototxt")
    model_path = os.path.join(folder_name, "mobilenet_iter_73000.caffemodel")

    if not os.path.exists(proto_path) or not os.path.exists(model_path):
        raise FileNotFoundError("必要なモデルファイルが見つかりません。")

    net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    height, width = image.shape[:2]
    blob = cv2.dnn.blobFromImage(image, 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    person_box = None
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.6:
            class_id = int(detections[0, 0, i, 1])
            if class_id == 15:
                box = detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                person_box = box.astype("int")
                break

    if person_box is None:
        print("人物が検出されませんでした。")
        return image

    segmented_person, mask = segment_person_in_box_with_improvements(image, person_box)
    #segmented_person, mask = segment_person(image, person_box)
    
    
    Public_name = "public/kitakyushu"
    random_file = get_random_file_name()
    background_path = os.path.join(Public_name, random_file["file"])
    background = cv2.imread(background_path)
    if background is None:
        raise FileNotFoundError(f"背景画像 {background_path} が見つかりません。")

    background = cv2.resize(background, (image.shape[1], image.shape[0]))

    target_height = int(height * 0.4)
    person_h, person_w = segmented_person.shape[:2]
    scale = target_height / person_h

    resized_person = cv2.resize(segmented_person, (int(person_w * scale), target_height))
    resized_mask = cv2.resize(mask, (int(person_w * scale), target_height), interpolation=cv2.INTER_NEAREST)

    person_h, person_w = resized_person.shape[:2]
    offset_x = max(0, (width - person_w) // 2)
    offset_y = max(0, (height - target_height) + int(height * 0.1))

    full_mask = np.zeros((height, width), dtype=np.uint8)

    target_slice = full_mask[offset_y:offset_y + person_h, offset_x:offset_x + person_w]
    if target_slice.shape != resized_mask.shape:
        resized_mask = cv2.resize(resized_mask, (target_slice.shape[1], target_slice.shape[0]), interpolation=cv2.INTER_NEAREST)
        resized_person = cv2.resize(resized_person, (target_slice.shape[1], target_slice.shape[0]))

    full_mask[offset_y:offset_y + person_h, offset_x:offset_x + person_w] = resized_mask

    full_person = np.zeros_like(image)
    full_person[offset_y:offset_y + person_h, offset_x:offset_x + person_w] = resized_person

    inverted_mask = cv2.bitwise_not(full_mask)
    background_part = cv2.bitwise_and(background, background, mask=inverted_mask)
    person_part = cv2.bitwise_and(full_person, full_person, mask=full_mask)

    combined = cv2.add(background_part, person_part)
    return combined
