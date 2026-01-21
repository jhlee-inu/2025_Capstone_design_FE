import { useLocation, useNavigate } from "react-router-dom";

import taeyangImg from "../assets/sasang/taeyang/taeyang.png";
import travel_solo from "../assets/sasang/taeyang/travel_solo.png";
import travel_spontaneous from "../assets/sasang/taeyang/travel_spontaneous.png";
import travel_extreme from "../assets/sasang/taeyang/travel_extreme.png";
import food_vegetable from "../assets/sasang/taeyang/food_vegetable.png";
import food_light from "../assets/sasang/taeyang/food_light.png";
import food_seafood from "../assets/sasang/taeyang/food_seafood.png";

import taeumImg from "../assets/sasang/taeum/taeum.png";
import travel_nature from "../assets/sasang/taeum/travel_nature.png";
import travel_hotel from "../assets/sasang/taeum/travel_staycation.png";
import travel_gourmet from "../assets/sasang/taeum/travel_foodtour.png";
import food_beef from "../assets/sasang/taeum/food_beef.png";
import food_nuts from "../assets/sasang/taeum/food_nuts.png";
import food_root from "../assets/sasang/taeum/food_root.png";

import soyangImg from "../assets/sasang/soyang/soyang.png";
import travel_hotplace from "../assets/sasang/soyang/travel_hotplace.png";
import travel_citynight from "../assets/sasang/soyang/travel_citytour.png";
import travel_social from "../assets/sasang/soyang/travel_social.png";
import food_pork from "../assets/sasang/soyang/food_pork.png";
import food_fruit from "../assets/sasang/soyang/food_fruit.png";
import food_seaweed from "../assets/sasang/soyang/food_seaweed.png";

import soeumImg from "../assets/sasang/soeum/soeum.png";
import travel_plan from "../assets/sasang/soeum/travel_planned.png";
import travel_hot_spring from "../assets/sasang/soeum/travel_hotspring.png";
import travel_culture from "../assets/sasang/soeum/travel_culture.png";
import food_chicken from "../assets/sasang/soeum/food_chicken.png";
import food_cooked_vegetable from "../assets/sasang/soeum/food_cookedvegetables.png";
import food_warming_tea from "../assets/sasang/soeum/food_tea.png";
import { IoClose } from "react-icons/io5";

const SASANG_RESULT = {
  태양인: {
    title: "태양인",
    character: taeyangImg,
    tagColor: "rgba(252, 230, 61, 0.55)", // #FCE63D
    tags: ["활동적", "리더형", "도전적"],
    travel: [
      { img: travel_solo, label: "혼자 여행" },
      { img: travel_spontaneous, label: "즉흥 여행" },
      { img: travel_extreme, label: "익스트림 체험" },
    ],
    food: [
      { img: food_vegetable, label: "차가운 채소" },
      { img: food_light, label: "담백한 저자극식" },
      { img: food_seafood, label: "싱싱한 해산물" },
    ],
  },
  소양인: {
    title: "소양인",
    character: soyangImg,
    tagColor: "rgba(255, 156, 41, 0.55)", // #FF9C29
    tags: ["창의적", "쾌활함", "직관적"],
    travel: [
      { img: travel_hotplace, label: "핫플레이스 탐방" },
      { img: travel_citynight, label: "야경 투어" },
      { img: travel_social, label: "소셜 액티비티" },
    ],
    food: [
      { img: food_pork, label: "부드러운 돼지고기" },
      { img: food_fruit, label: "수분 가득한 과일" },
      { img: food_seaweed, label: "신선한 해조류" },
    ],
  },
  태음인: {
    title: "태음인",
    character: taeumImg,
    tagColor: "rgba(136, 226, 66, 0.55)", // #88E242
    tags: ["안정적", "신중한", "책임감"],
    travel: [
      { img: travel_nature, label: "자연 힐링 여행" },
      { img: travel_hotel, label: "여유로운 호캉스" },
      { img: travel_gourmet, label: "미식 탐방" },
    ],
    food: [
      { img: food_beef, label: "든든한 소고기" },
      { img: food_nuts, label: "고소한 견과류" },
      { img: food_root, label: "뿌리 채소 요리" },
    ],
  },
  소음인: {
    title: "소음인",
    character: soeumImg,
    tagColor: "rgba(174, 230, 250, 0.55)", // #AEE6FA
    tags: ["내향적", "신중한", "분석적"],
    travel: [
      { img: travel_plan, label: "계획 여행" },
      { img: travel_hot_spring, label: "따뜻한 온천욕" },
      { img: travel_culture, label: "문화 예술 관람" },
    ],
    food: [
      { img: food_chicken, label: "따뜻한 닭요리" },
      { img: food_cooked_vegetable, label: "익힌 채소" },
      { img: food_warming_tea, label: "몸을 데우는 차" },
    ],
  },
};

export default function SasangResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from || "/InfoInput";

  // SasangTest에서 navigate("/sasang-result", { state: { sasangResult: mockResult } })로 넘긴 값을 받음
  const result = location.state?.sasangResult;

  // 결과가 없으면(직접 URL 접근 등) 기본값 처리
  const sasangType = result?.type || "소음인";
  const data = SASANG_RESULT[sasangType];

  const Tag = ({ children }) => (
    <span
      className="rounded-full px-3 py-1 text-sm font-medium text-gray-900"
      style={{
        backgroundColor: data.tagColor,
      }}
    >
      #{children}
    </span>
  );

  const Card = ({ img, label }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="h-[82px] w-[110px] rounded-xl bg-gray-100 flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={label}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span className="text-xs text-gray-400">준비중</span>
        )}
      </div>
      <p className="text-[13px] font-semibold text-gray-800">{label || "준비중"}</p>
    </div>
  );

  const Section = ({ title, items }) => (
    <section className="mt-8">
      <h3 className="mb-3 text-base font-semibold text-gray-900">{title}</h3>
      <div className="flex justify-center gap-4">
        {items.map((it, idx) => (
          <Card key={`${title}-${idx}`} {...it} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="h-12 flex items-center px-4">
        <div className="w-6" />
        <h1 className="flex-1 text-center font-extrabold">테스트 결과</h1>
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="flex items-center justify-center text-2xl leading-none"
        >
          <IoClose size={24} />
        </button>
      </header>

      {/* 본문 */}
      <main className="flex-1 px-6">
        <div className="mt-5 flex flex-col items-center">
          <img
            src={data.character}
            alt={data.title}
            className="block h-[170px] w-[170px] object-contain"
          />
        
          <h3 className="-mt-2 text-xl font-bold">{data.title}</h3>

          {/* 태그 */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {data.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* 섹션들 */}
        <div className="mt-10 flex flex-col items-center">
          <div className="w-full max-w-[360px]">
            <Section title="이런 여행 스타일이 잘 맞아요" items={data.travel} />
            <Section title="이런 음식이 잘 맞아요" items={data.food} />
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="px-6 pb-14">
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="h-14 w-full rounded-2xl bg-blue-600 text-white font-extrabold"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
