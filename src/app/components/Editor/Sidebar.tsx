import React, { useState } from "react";
import { ObjectProps } from "./Object/types"; // ObjectProps型をインポート
import { FaDeleteLeft, FaAngleUp, FaAngleDown } from "react-icons/fa6"; // アイコンをインポート

type SidebarProps = {
  objects: ObjectProps[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const Sidebar: React.FC<SidebarProps> = ({ objects, setObjects }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // ドロップ可能にする
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      const reorderedItems = [...objects];
      const [draggedItem] = reorderedItems.splice(draggedItemIndex, 1);
      reorderedItems.splice(index, 0, draggedItem);

      setObjects(reorderedItems);
      setDraggedItemIndex(index);
    }
  };

  const handleDrop = () => {
    setDraggedItemIndex(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const reorderedItems = [...objects];
    const [movedItem] = reorderedItems.splice(index, 1);
    const newIndex = direction === "up" ? index - 1 : index + 1;

    reorderedItems.splice(newIndex, 0, movedItem);
    setObjects(reorderedItems);

    // Z-indexを調整する
    if (direction === "up") {
      movedItem.zIndex = (movedItem.zIndex || 1) + 1;
    } else {
      movedItem.zIndex = (movedItem.zIndex || 1) - 1;
    }
    setObjects([...reorderedItems]);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
        background: "#f4f4f4",
        overflowY: "auto",
      }}
    >
      <h3>Object</h3>
      {objects.map((obj, index) => (
        <div
          key={obj.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px",
            margin: "4px 0",
            background:
              selectedId === obj.id ? "#d1ecf1" : "#ddd",
            borderRadius: "4px",
            cursor: "grab",
            zIndex: obj.zIndex || 1,
          }}
          onClick={() => setSelectedId(obj.id)}
        >
          <span>
            {obj.type === "text" && `Text: ${obj.text}`}
            {obj.type === "shape" && `Shape: ${obj.fill}`}
            {obj.type === "image" && "Image"}
          </span>

          {selectedId === obj.id && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaAngleUp
                onClick={(e) => {
                  e.stopPropagation();
                  moveItem(index, "up");
                }}
                style={{
                  cursor: "pointer",
                  marginRight: "8px",
                  color: "#5bc0de",
                  fontSize: "18px",
                }}
              />
              <FaAngleDown
                onClick={(e) => {
                  e.stopPropagation();
                  moveItem(index, "down");
                }}
                style={{
                  cursor: "pointer",
                  marginRight: "8px",
                  color: "#f0ad4e",
                  fontSize: "18px",
                }}
              />
              <FaDeleteLeft
                onClick={(e) => {
                  e.stopPropagation();
                  setObjects((prevObjects) =>
                    prevObjects.filter((o) => o.id !== obj.id)
                  );
                }}
                style={{
                  cursor: "pointer",
                  color: "#d9534f",
                  fontSize: "18px",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
