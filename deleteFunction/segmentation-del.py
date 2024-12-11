def keep_inside_of_contours(image: np.ndarray, person_box: tuple) -> tuple:
    x1, y1, x2, y2 = person_box

    # 矩形領域の切り出し
    person_roi = image[y1:y2, x1:x2]

    # Step 1: グレースケール変換
    gray = cv2.cvtColor(person_roi, cv2.COLOR_BGR2GRAY)

    # Step 2: ぼかし処理でノイズを低減
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Step 3: エッジ検出（Canny法）
    edges = cv2.Canny(blurred, threshold1=100, threshold2=200)

    # Step 4: 輪郭を抽出
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("輪郭が見つかりませんでした。")
        return person_roi, np.zeros_like(gray)  # 輪郭が見つからなければ、元の画像と空のマスクを返す

    # 最大輪郭を選択
    largest_contour = max(contours, key=cv2.contourArea)

    # マスクを作成（内側を白くする）
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [largest_contour], -1, 255, thickness=cv2.FILLED)

    # 内側をマスクで保持
    segmented_person = cv2.bitwise_and(person_roi, person_roi, mask=mask)

    return segmented_person, mask

def snake_segmentation(image: np.ndarray, person_box: tuple) -> np.ndarray:
    x1, y1, x2, y2 = person_box

    # 矩形領域の切り出し
    person_roi = image[y1:y2, x1:x2]

    # Step 1: グレースケール変換
    gray = cv2.cvtColor(person_roi, cv2.COLOR_BGR2GRAY)

    # Step 2: ぼかし処理でノイズを低減
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Step 3: エッジ検出（Canny法）
    edges = cv2.Canny(blurred, threshold1=100, threshold2=200)

    # Step 4: スネーク法を使用した輪郭抽出
    contours = measure.find_contours(edges, level=0.8)

    if not contours:
        print("スネーク法で輪郭が見つかりませんでした。")
        return person_roi

    # 最も大きな輪郭を選択
    largest_contour = max(contours, key=lambda x: cv2.contourArea(np.array(x, dtype=np.int32)))

    # マスクを作成
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [np.array(largest_contour, dtype=np.int32)], -1, 255, thickness=cv2.FILLED)

    # Step 5: マスクを適用して人物領域を抽出
    segmented_person = cv2.bitwise_and(person_roi, person_roi, mask=mask)

    return segmented_person, mask



def coarse_segmentation(image: np.ndarray, person_box: tuple) -> np.ndarray:
    x1, y1, x2, y2 = person_box

    # 矩形領域の切り出し
    person_roi = image[y1:y2, x1:x2]

    # Step 1: グレースケール変換
    gray = cv2.cvtColor(person_roi, cv2.COLOR_BGR2GRAY)

    # Step 2: ぼかし処理でノイズを低減
    blurred = cv2.GaussianBlur(gray, (15, 15), 0)  # 大きめのカーネルでぼかし

    # Step 3: エッジ検出（Canny法）
    edges = cv2.Canny(blurred, threshold1=150, threshold2=300)  # 高いしきい値でエッジを大まかに抽出

    # Step 4: エッジの拡張（モルフォロジー変換）
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 10))  # 大きなカーネルで膨張処理
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

    # Step 5: 輪郭抽出
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("エッジ検出で輪郭が見つかりませんでした。")
        return person_roi

    # Step 6: 最大輪郭を特定
    largest_contour = max(contours, key=cv2.contourArea)

    # Step 7: マスクを作成
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [largest_contour], -1, 255, thickness=cv2.FILLED)

    # Step 8: マスクを適用して人物領域を抽出
    segmented_person = cv2.bitwise_and(person_roi, person_roi, mask=mask)

    return segmented_person, mask
