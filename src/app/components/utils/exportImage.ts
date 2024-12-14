import Konva from 'konva';
import axios from 'axios';

export const exportToImage = async (stageRef: React.RefObject<Konva.Stage>) => {
  if (stageRef.current) {
    const dataUrl = stageRef.current.toDataURL();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload-image', // POSTリクエスト
        { image: dataUrl },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        console.log('画像が保存されました:', response.data.filePath);
      } else {
        console.error('画像保存に失敗しました');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
};
