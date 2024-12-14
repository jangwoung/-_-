import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Modal } from "@/app/components/modal";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface SearchProps {
  searchOpened: boolean;
  setSearchOpened: (searchOpened: boolean) => void;
}

type prefectureItem = {
  value: string;
  label: string;
};

type cityItem = {
  prefecture: string;
  value: string;
  label: string;
};

const prefectureMenuItems: prefectureItem[] = [
  { value: "hokkaido", label: "北海道" },
  { value: "aomori", label: "青森県" },
  { value: "iwate", label: "岩手県" },
  { value: "miyagi", label: "宮城県" },
  { value: "akita", label: "秋田県" },
  { value: "yamagata", label: "山形県" },
  { value: "fukushima", label: "福島県" },
  { value: "ibaraki", label: "茨城県" },
  { value: "tochigi", label: "栃木県" },
  { value: "gunma", label: "群馬県" },
  { value: "saitama", label: "埼玉県" },
  { value: "chiba", label: "千葉県" },
  { value: "tokyo", label: "東京都" },
  { value: "kanagawa", label: "神奈川県" },
  { value: "niigata", label: "新潟県" },
  { value: "toyama", label: "富山県" },
  { value: "ishikawa", label: "石川県" },
  { value: "fukui", label: "福井県" },
  { value: "yamanashi", label: "山梨県" },
  { value: "nagano", label: "長野県" },
  { value: "gifu", label: "岐阜県" },
  { value: "shizuoka", label: "静岡県" },
  { value: "aichi", label: "愛知県" },
  { value: "mie", label: "三重県" },
  { value: "shiga", label: "滋賀県" },
  { value: "kyoto", label: "京都府" },
  { value: "osaka", label: "大阪府" },
  { value: "hyogo", label: "兵庫県" },
  { value: "nara", label: "奈良県" },
  { value: "wakayama", label: "和歌山県" },
  { value: "tottori", label: "鳥取県" },
  { value: "shimane", label: "島根県" },
  { value: "okayama", label: "岡山県" },
  { value: "hiroshima", label: "広島県" },
  { value: "yamaguchi", label: "山口県" },
  { value: "tokushima", label: "徳島県" },
  { value: "kagawa", label: "香川県" },
  { value: "ehime", label: "愛媛県" },
  { value: "kochi", label: "高知県" },
  { value: "fukuoka", label: "福岡県" },
  { value: "saga", label: "佐賀県" },
  { value: "nagasaki", label: "長崎県" },
  { value: "kumamoto", label: "熊本県" },
  { value: "oita", label: "大分県" },
  { value: "miyazaki", label: "宮崎県" },
  { value: "kagoshima", label: "鹿児島県" },
  { value: "okinawa", label: "沖縄県" },
];

const cityMenuItems: cityItem[] = [
  { prefecture: "fukuoka", value: "kitakyushu", label: "北九州市" },
  { prefecture: "fukuoka", value: "fukuoka", label: "福岡市" },
  { prefecture: "fukuoka", value: "kurume", label: "久留米市" },
  { prefecture: "fukuoka", value: "omuta", label: "大牟田市" },
  { prefecture: "fukuoka", value: "nogata", label: "直方市" },
  { prefecture: "fukuoka", value: "iizuka", label: "飯塚市" },
  { prefecture: "fukuoka", value: "tagawa", label: "田川市" },
  { prefecture: "fukuoka", value: "yanagawa", label: "柳川市" },
  { prefecture: "fukuoka", value: "yame", label: "八女市" },
  { prefecture: "fukuoka", value: "chikugo", label: "筑後市" },
  { prefecture: "fukuoka", value: "okawa", label: "大川市" },
  { prefecture: "fukuoka", value: "yukuhashi", label: "行橋市" },
  { prefecture: "fukuoka", value: "buzen", label: "豊前市" },
  { prefecture: "fukuoka", value: "nakama", label: "中間市" },
  { prefecture: "fukuoka", value: "ogori", label: "小郡市" },
  { prefecture: "fukuoka", value: "chikushino", label: "筑紫野市" },
  { prefecture: "fukuoka", value: "kasuga", label: "春日市" },
  { prefecture: "fukuoka", value: "onojo", label: "大野城市" },
  { prefecture: "fukuoka", value: "munakata", label: "宗像市" },
  { prefecture: "fukuoka", value: "dazaifu", label: "太宰府市" },
  { prefecture: "fukuoka", value: "koga", label: "古賀市" },
  { prefecture: "fukuoka", value: "fukutsu", label: "福津市" },
];

export const Search: React.FC<SearchProps> = ({
  searchOpened,
  setSearchOpened,
}) => {
  const [prefectureOpen, setPrefectureOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("heko");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const prefecture = queryParams.get("prefecture");
    const city = queryParams.get("city");
    if (prefecture) setSelectedPrefecture(prefecture);
    if (city) setSelectedCity(city);
  }, []);

  const handleSetQuery = (prefecture: string, city: string) => {
    if (!prefecture || !city) {
      alert("都道府県と「市か区」を選択してください。");
      return;
    }
    const currentQuery = new URLSearchParams(window.location.search);
    currentQuery.set("prefecture", prefecture);
    currentQuery.set("city", city);
    router.push(`${pathname}?${currentQuery.toString()}`);

    setSearchOpened(false);
  };

  const toggleDropdownPrefecture = () => {
    setPrefectureOpen(!prefectureOpen);
  };

  const toggleDropdownCity = () => {
    setCityOpen(!cityOpen);
  };

  const handleItemClickPrefecture = (item: prefectureItem) => {
    setSelectedPrefecture(item.value);
    setPrefectureOpen(false);
    console.log(`選択された項目: ${item.label}`);
  };

  const handleItemClickCity = (item: cityItem) => {
    setSelectedCity(item.value);
    setCityOpen(false);
    console.log(`選択された項目: ${item.label}`);
  };

  const filteredCityMenuItems = cityMenuItems.filter(
    (item) => item.prefecture === selectedPrefecture
  );

  return (
    <div>
      {!searchOpened ? (
        <div
          className="fixed bottom-2 sm:bottom-4 right-4 rounded-[16px] bg-beige w-12 sm:w-16 aspect-square flex justify-center items-center"
          onClick={() => setSearchOpened(true)}
        >
          <FontAwesomeIcon icon={faSearch} className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      ) : (
        <Modal isOpened={searchOpened} setIsOpened={setSearchOpened}>
          <div>
            <h1 className="text-lg font-bold text-center my-4">
              「市か区」検索
            </h1>
            <div>
              <button
                onClick={toggleDropdownPrefecture}
                className="mt-4 mx-[10vw] w-[80vw] sm:w-[360px] px-4 py-2 text-center font-bold bg-white border border-green-light rounded shadow-sm focus:outline-none"
              >
                {selectedPrefecture
                  ? prefectureMenuItems.find(
                      (item) => item.value === selectedPrefecture
                    )?.label
                  : "都道府県を選択"}
              </button>

              {prefectureOpen && (
                <ul className="absolute z-10 mx-[10vw] w-[80vw] sm:w-[360px] h-[40vh] mt-1 bg-white border border-green-light rounded shadow-lg overflow-y-scroll">
                  {prefectureMenuItems.map((item) => (
                    <li
                      key={item.value}
                      onClick={() => handleItemClickPrefecture(item)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <button
                onClick={toggleDropdownCity}
                className="mt-4 mx-[10vw] w-[80vw] sm:w-[360px] px-4 py-2 text-center font-bold bg-white border border-green-light rounded shadow-sm focus:outline-none"
              >
                {selectedCity
                  ? cityMenuItems.find((item) => item.value === selectedCity)
                      ?.label
                  : "「市か区」を選択"}
              </button>

              {cityOpen && (
                <ul className="absolute z-10 mx-[10vw]  w-[80vw] sm:w-[360px] h-[32vh] mt-1 bg-white border border-green-light rounded shadow-lg overflow-y-scroll">
                  {filteredCityMenuItems.map((item) => (
                    <li
                      key={item.value}
                      onClick={() => handleItemClickCity(item)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="py-2 mt-8 mx-[18vw] sm:mx-[120px] w-[64vw] sm:w-[280px] bg-green-light text-white text-center font-bold rounded-lg"
              onClick={() => handleSetQuery(selectedPrefecture, selectedCity)}
            >
              「市か区」
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
