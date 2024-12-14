import { redirect } from "next/navigation";

export const redirectToVoucher = (imageUrl: string | null) => {
  if (imageUrl) {
    // 画像URLが存在する場合、Voucherページへリダイレクト
    redirect(`/voucher?image=${encodeURIComponent(imageUrl)}`);
  } else {
    console.error("画像のエクスポートに失敗しました");
  }
};
