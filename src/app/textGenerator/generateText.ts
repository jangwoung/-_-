import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini APIの初期化 (環境変数からAPIキーを取得)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// 生成されるテキストのインターフェース
export interface LocationText {
  descriptor: string;
  dialect: string;
  description: string;
}

/**
 * 指定された地名に基づいてテキストを生成する関数
 * @param location - テキストを生成する地名
 * @returns 生成されたテキストを含むオブジェクト
 */
export async function generateLocationText(location: string): Promise<LocationText> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // 特徴的な形容詞の生成 (最大10文字)
    const descriptorPrompt = `
    次の地名の魅力を的確に表現する特徴的な形容詞を、最大10文字以内で生成してください。
    地名: ${location}
    この地名が持つ特性や印象的な要素を反映させた形容詞にしてください。例えば、自然、文化、歴史、現代性などの特徴に基づいてください。
    `;
    const descriptorResult = await model.generateContent(descriptorPrompt);
    const descriptor = descriptorResult.response.text().trim().slice(0, 10);

    // 方言やローカルな言い回しの生成 (最大10文字)
    const dialectPrompt = `
    次の地名でよく使われる方言やローカルな言い回しを、最大10文字以内で生成してください。
    地名: ${location}
    地元の人々が日常的に使う、特徴的で親しみやすい言葉やフレーズを考え、地域性を感じさせる言葉にしてください。
    `;
    const dialectResult = await model.generateContent(dialectPrompt);
    const dialect = dialectResult.response.text().trim().slice(0, 10);

    // 地名の魅力に関する説明の生成 (最大30文字)
    const descriptionPrompt = `
    次の地名の観光名所や特徴を簡潔に説明してください。最大30文字以内で、観光地としての魅力を強調した内容にしてください。
    地名: ${location}
    この地名が持つ歴史的、文化的、または自然的な魅力を伝えることを意識してください。
    `;
    const descriptionResult = await model.generateContent(descriptionPrompt);
    const description = descriptionResult.response.text().trim().slice(0, 40);

    return {
      descriptor,
      dialect,
      description
    };
  } catch (error) {
    console.error("テキスト生成中にエラーが発生しました:", error);
    
    // APIコール失敗時のフォールバックテキスト
    return {
      descriptor: "産業大好き北九州",
      dialect: "きたきゅーの底力みせるっちゃ",
      description: "歴史的な名所や美しい自然が調和した魅力的な街、北九州市。産業遺産や博物館、豊かな緑に囲まれた観光地を巡り、心に残るひとときを。"
    };
  }
}