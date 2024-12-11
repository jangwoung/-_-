const applySepiaStyle = async (imageBlob: Blob): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", imageBlob); // Blobとして画像をサーバーに送信
  
    try {
      const response = await fetch("http://127.0.0.1:5000/sepia-style", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob); // 画像URLを返す
      } else {
        console.error("セピア風画像処理に失敗しました");
        return null;
      }
    } catch (error) {
      console.error("エラー:", error);
      return null;
    }
  };

  export default applySepiaStyle;
  