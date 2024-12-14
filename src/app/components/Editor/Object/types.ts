// ObjectProps型にshapeタイプを追加
export type ObjectProps = {
    id: number;
    type: "image" | "text" | "shape"; // "shape"を追加
    x: number;
    y: number;
    image?: HTMLImageElement;
    text?: string;
    fill?: string; // 図形やテキストの色
    fontSize?: number; // フォントサイズ (テキストオブジェクト用)
    fontFamily?: string; // フォントファミリー (テキストオブジェクト用)
    zIndex?: number;
    width?: number;  // 図形の幅
    height?: number; // 図形の高さ
    stroke?: string; // 図形の枠線の色
    rotation?: number; // 図形の回転角度
  };
  