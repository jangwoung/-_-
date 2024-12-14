import { useSearchParams } from "next/navigation";

export const useImageFromQuery = (): string | null => {
  const searchParams = useSearchParams();
  return searchParams.get("image");  // クエリパラメータから"image"を取得
};
