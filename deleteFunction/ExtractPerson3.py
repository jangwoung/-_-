import torch
import torchvision.transforms as transforms
import numpy as np
import cv2

def pytorch_person_segmentation(image: np.ndarray) -> np.ndarray:
    # モデルの読み込み
    model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet50', pretrained=True)
    model.eval()

    # 画像の前処理
    preprocess = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # OpenCVの画像をPyTorchテンソルに変換
    input_tensor = preprocess(image).unsqueeze(0)

    # セグメンテーションの実行
    with torch.no_grad():
        output = model(input_tensor)['out'][0]
    
    # セグメンテーション結果の後処理
    sem_classes = [
        '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
        'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
        'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag',
        'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
        'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon',
        'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot',
        'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
        'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
        'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
        'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
        'hair drier', 'toothbrush'
    ]

    # 人物クラスのインデックスを取得
    person_index = sem_classes.index('person')

    # セマンティックセグメンテーション結果からマスクを作成
    normalized_masks = torch.nn.functional.softmax(output, dim=0)
    person_mask = normalized_masks[person_index].numpy()
    
    # マスクの2値化
    person_mask_binary = (person_mask > 0.5).astype(np.uint8) * 255

    # 元の画像サイズにリサイズ
    person_mask_resized = cv2.resize(person_mask_binary, (image.shape[1], image.shape[0]))

    # マスクを使用して人物を抽出
    masked_person = cv2.bitwise_and(image, image, mask=person_mask_resized)

    # 白背景に人物を配置
    white_background = np.ones_like(image) * 255
    white_background[person_mask_resized > 0] = masked_person[person_mask_resized > 0]

    return white_background

def extract_person_and_attach_dnn(image: np.ndarray) -> np.ndarray:
    """
    元の関数を拡張し、PyTorchベースのセマンティックセグメンテーションを統合
    """
    return pytorch_person_segmentation(image)