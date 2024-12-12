// utils/drawingUtils.js

export const handleMouseDown = (e, isDrawing, setDrawingShape, setIsDrawing) => {
    if (!isDrawing) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      const id = `rect-${Date.now()}`;
      setDrawingShape({
        id,
        x: point?.x || 0,
        y: point?.y || 0,
        width: 0,
        height: 0,
        fill: "blue",
        draggable: true,
      });
      setIsDrawing(true);
    }
  };
  
  export const handleMouseMove = (e, isDrawing, drawingShape, setDrawingShape) => {
    if (!isDrawing || !drawingShape) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const newShape = {
      ...drawingShape,
      width: (point?.x || 0) - drawingShape.x,
      height: (point?.y || 0) - drawingShape.y,
    };
    setDrawingShape(newShape);
  };
  
  export const handleMouseUp = (isDrawing, drawingShape, setDrawingShape, setIsDrawing, setShapes) => {
    if (isDrawing && drawingShape) {
      setShapes((prev) => [...prev, { id: drawingShape.id, type: "rect", props: drawingShape }]);
      setDrawingShape(null);
    }
    setIsDrawing(false);
  };
  
  // 画像のリサイズ
  export const resizeShape = (e, shape, setShapes) => {
    const { width, height, id, x, y } = shape;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const newWidth = pointerPosition.x - x;
    const newHeight = pointerPosition.y - y;
  
    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              props: {
                ...s.props,
                width: newWidth > 0 ? newWidth : width,
                height: newHeight > 0 ? newHeight : height,
              },
            }
          : s
      )
    );
  };
  
  // 画像を削除する
  export const deleteShape = (id, setShapes) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));
  };
  