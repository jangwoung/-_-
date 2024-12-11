const applyAnimeStyle = async (imageBlob: Blob): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", imageBlob);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/anime-style", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob); // アニメ風変換された画像のURLを返す
      } else {
        console.error("アニメ風画像処理に失敗しました");
        return null;
      }
    } catch (error) {
      console.error("エラー:", error);
      return null;
    }
  };
  
  export default applyAnimeStyle;
  