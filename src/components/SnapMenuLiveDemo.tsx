import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Volume2,
  Wine,
  Flame,
  ShieldCheck,
  Plus,
  MessageSquareHeart,
  UtensilsCrossed,
  CheckCircle2
} from 'lucide-react';

type LangCode = 'en' | 'es' | 'ja' | 'hi';

interface DishItem {
  id: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  allergens: string[];
  pairing: string;
  translations: Record<
    LangCode,
    {
      name: string;
      description: string;
    }
  >;
}

const INITIAL_DISHES: DishItem[] = [
  {
    id: '1',
    price: 22,
    calories: 540,
    protein: 42,
    carbs: 38,
    fat: 22,
    tags: ['High-Protein', 'Gluten-Free'],
    allergens: ['Fish', 'Sesame'],
    pairing: 'Pairs with Sparkling Yuzu Sencha or crisp Sauvignon Blanc.',
    translations: {
      en: {
        name: 'Yuzu Miso Glazed Wild Salmon Bowl',
        description: 'Charred wild king salmon over forbidden black rice with pickled ginger, edamame, and citrus miso glaze.'
      },
      es: {
        name: 'Bowl de Salmón Salvaje con Glaseado de Yuzu y Miso',
        description: 'Salmón real a la parrilla sobre arroz negro prohibido con jengibre encurtido, edamame y glaseado cítrico.'
      },
      ja: {
        name: '柚子味噌グレーズド・ワイルドサーモンボウル',
        description: '黒米の上に香ばしく焼き上げた天然キングサーモン、紅生姜、枝豆、柑橘系の柚子味噌ソースを添えて。'
      },
      hi: {
        name: 'युज़ु मिसो ग्लेज़्ड वाइल्ड सैल्मन बाउल',
        description: 'काली चावल के ऊपर ग्रिल्ड वाइल्ड सैल्मन, अचार वाला अदरक, एडामे और खट्टे युज़ु मिसो ग्लेज़ के साथ।'
      }
    }
  },
  {
    id: '2',
    price: 19,
    calories: 490,
    protein: 18,
    carbs: 54,
    fat: 21,
    tags: ['Vegan', 'Under 600 kcal'],
    allergens: ['Mushrooms'],
    pairing: 'Pairs with Roasted Barley Artisanal Tea or Earthy Pinot Noir.',
    translations: {
      en: {
        name: 'Black Truffle & Wild Chanterelle Risotto',
        description: 'Creamy cashew-infused Arborio rice slow-simmered with roasted forest chanterelles, thyme, and shaved black truffle.'
      },
      es: {
        name: 'Risotto de Trufa Negra y Rebozuelos Silvestres',
        description: 'Cremoso arroz Arborio con infusión de anacardos, setas del bosque asadas, tomillo y láminas de trufa negra.'
      },
      ja: {
        name: '黒トリュフと野生アンズタケのリゾット',
        description: 'カシューナッツクリームで仕上げたアルボリオ米に、ローストしたアンズタケ、タイム、黒トリュフを贅沢に。'
      },
      hi: {
        name: 'ब्लैक ट्रफल और वाइल्ड मशरूम रिसोट्टो',
        description: 'काजू क्रीम और भुने हुए जंगली मशरूम, थाइम और ब्लैक ट्रफल के साथ धीमी आंच पर पकाया गया आर्बोरियो चावल।'
      }
    }
  },
  {
    id: '3',
    price: 17,
    calories: 580,
    protein: 34,
    carbs: 44,
    fat: 26,
    tags: ['High-Protein', 'Under 600 kcal'],
    allergens: ['Gluten', 'Soy', 'Sesame'],
    pairing: 'Pairs with Cold-Pressed Ginger Lime Fizz or Japanese Craft Lager.',
    translations: {
      en: {
        name: 'Charred Wagyu Brisket & Crispy Chili Bao',
        description: '12-hour smoked Wagyu brisket tucked into fluffy steamed lotus buns with house chili crunch and pickled cucumber.'
      },
      es: {
        name: 'Bao de Brisket Wagyu Ahumado y Chile Crujiente',
        description: 'Brisket Wagyu ahumado por 12 horas en panecillos al vapor con salsa de chile crujiente y pepino encurtido.'
      },
      ja: {
        name: '炙り和牛ブリスケット＆クリスピーチリパオ',
        description: '12時間スモークした和牛ブリスケットをふわふわの蒸しパンに挟み、自家製ラー油とピクルスをアクセントに。'
      },
      hi: {
        name: 'चार्ड वाग्यू ब्रिस्केट और क्रिस्पी चिली बाओ',
        description: '12 घंटे तक स्मोक किया हुआ वाग्यू ब्रिस्केट, नरम स्टीम्ड बन, क्रिस्पी चिली क्रंच और खीरे के अचार के साथ।'
      }
    }
  }
];

export const SnapMenuLiveDemo: React.FC = () => {
  const [lang, setLang] = useState<LangCode>('en');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [dishes, setDishes] = useState<DishItem[]>(INITIAL_DISHES);
  const [chefInput, setChefInput] = useState(
    'Crispy Hot Honey Halloumi Tacos with Avocado Crema & Charred Corn - $16'
  );
  const [isEnriching, setIsEnriching] = useState(false);

  // Lab 4 Upgrade: AI Sommelier Concierge state
  const [sommelierQuery, setSommelierQuery] = useState(
    'I want a high-protein dish with zero gluten—what should I order?'
  );
  const [sommelierReply, setSommelierReply] = useState(
    '🍷 AI Sommelier Recommendation: Go for the "Yuzu Miso Glazed Wild Salmon Bowl" ($22)! It packs 42g of protein, is 100% Gluten-Free, and pairs wonderfully with Sparkling Yuzu Sencha.'
  );

  const handleEnrichDish = () => {
    if (!chefInput.trim()) return;
    setIsEnriching(true);
    setTimeout(() => {
      const cleanTitle = chefInput.split('-')[0].trim();
      const newDish: DishItem = {
        id: String(Date.now()),
        price: 16,
        calories: 510,
        protein: 26,
        carbs: 42,
        fat: 24,
        tags: ['High-Protein', 'Gluten-Free', 'Under 600 kcal'],
        allergens: ['Dairy'],
        pairing: 'Pairs with Smoked Mezcal Paloma or Hibiscus Iced Agua Fresca.',
        translations: {
          en: {
            name: cleanTitle,
            description:
              'Golden pan-seared Cypriot halloumi drizzled with infused chili blossom honey, whipped avocado lime crema, and charred heirloom corn on warm nixtamal tortillas.'
          },
          es: {
            name: `Tacos de Halloumi Crujiente con Miel Picante (${cleanTitle})`,
            description:
              'Queso halloumi dorado con miel de flores y chile, crema batida de aguacate y maíz asado en tortillas calientes.'
          },
          ja: {
            name: `クリスピー・ホットハニー・ハルーミタコス (${cleanTitle})`,
            description:
              '香ばしく焼いたハルーミチーズにスパイシーな蜂蜜、アボカドライムクレマ、焼き옥수수を添えた特製タコス。'
          },
          hi: {
            name: `क्रिस्पी हॉट हनी हौलोमी टैकोस (${cleanTitle})`,
            description:
              'मसालेदार शहद, एवोकाडो लाइम क्रेमा और भुने हुए मक्के के साथ सुनहरा ग्रिल्ड हौलोमी पनीर टैकोस।'
          }
        }
      };
      setDishes([newDish, ...dishes]);
      setIsEnriching(false);
    }, 650);
  };

  const handleAskSommelier = () => {
    const q = sommelierQuery.toLowerCase();
    if (q.includes('vegan') || q.includes('plant') || q.includes('mushroom')) {
      setSommelierReply(
        '🍷 AI Sommelier: I highly recommend the "Black Truffle & Wild Chanterelle Risotto" ($19). It is 100% plant-based (cashew-infused), only 490 kcal, and pairs beautifully with Roasted Barley Tea!'
      );
    } else if (q.includes('spicy') || q.includes('wagyu') || q.includes('meat')) {
      setSommelierReply(
        '🍷 AI Sommelier: Try our signature "Charred Wagyu Brisket & Crispy Chili Bao" ($17)! It delivers 34g of protein with house-made chili crunch and pairs with Cold-Pressed Ginger Lime Fizz.'
      );
    } else {
      setSommelierReply(
        '🍷 AI Sommelier: Based on your goals, the "Yuzu Miso Glazed Wild Salmon Bowl" ($22) is your ideal match—42g complete protein, gluten-free, and 540 kcal!'
      );
    }
  };

  const speakDish = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      lang === 'es' ? 'es-ES' : lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const filteredDishes = dishes.filter((d) =>
    activeFilter === 'All' ? true : d.tags.includes(activeFilter)
  );

  return (
    <div className="my-6 rounded-2xl border-2 border-stone-300 bg-[#FAF7F2] text-[#1C1917] shadow-lg overflow-hidden">
      {/* Top Preview Banner */}
      <div className="px-5 py-3 bg-[#1C1917] text-stone-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Interactive Live Preview: "SnapMenu AI" (What You Will Build & Deploy!)
          </span>
        </div>

        {/* 1-Click Multilingual Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-xl border border-stone-700">
          <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
          {(
            [
              { code: 'en', label: 'EN • English' },
              { code: 'es', label: 'ES • Español' },
              { code: 'ja', label: 'JA • 日本語' },
              { code: 'hi', label: 'HI • हिन्दी' }
            ] as const
          ).map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                lang === l.code
                  ? 'bg-[#E05A47] text-white shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bistro Studio Grid */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Top Row: Owner AI Dish Enricher + Dietary Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Owner Mode: AI Dish Creator */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E05A47] flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  Owner Mode: AI Menu Enricher (Strict JSON Schema)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  @google/genai Ready
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Type any raw dish idea below—Gemini automatically calculates calories/macros, flags allergens, writes sensory copy, and translates into 4 languages:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={chefInput}
                onChange={(e) => setChefInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                placeholder="e.g. Spicy Miso Ramen with Pork Belly - $18"
              />
              <button
                onClick={handleEnrichDish}
                disabled={isEnriching}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#E05A47] hover:bg-[#c94a38] text-white text-xs font-extrabold shadow-sm transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEnriching ? 'Enriching with Gemini...' : '✨ Enrich & Add Dish'}</span>
              </button>
            </div>
          </div>

          {/* Lab 4 Feature Preview: AI Sommelier & Dietary Concierge */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  Lab 4 Upgrade: AI Sommelier Concierge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Added in AI Studio!
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  value={sommelierQuery}
                  onChange={(e) => setSommelierQuery(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-white"
                />
                <button
                  onClick={handleAskSommelier}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shrink-0"
                >
                  Ask AI
                </button>
              </div>
            </div>
            <p className="text-[11px] text-emerald-300 mt-2.5 leading-relaxed bg-stone-800/90 p-2.5 rounded-lg border border-stone-700">
              {sommelierReply}
            </p>
          </div>
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-stone-500 mr-1">Filter Menu:</span>
            {['All', 'High-Protein', 'Vegan', 'Gluten-Free', 'Under 600 kcal'].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  activeFilter === tag
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-stone-500">
            Showing {filteredDishes.length} AI-Enriched Dishes ({lang.toUpperCase()})
          </span>
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => {
            const t = dish.translations[lang];
            return (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-extrabold text-sm text-stone-900 leading-snug">
                      {t.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-black text-xs shrink-0">
                      ${dish.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {t.description}
                  </p>

                  {/* Macro Rings Bar */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#FAF7F2] border border-stone-200/80 text-center mb-3">
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">KCAL</div>
                      <div className="text-xs font-extrabold text-[#E05A47]">{dish.calories}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">PRO</div>
                      <div className="text-xs font-extrabold text-emerald-700">{dish.protein}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">CARB</div>
                      <div className="text-xs font-extrabold text-stone-800">{dish.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">FAT</div>
                      <div className="text-xs font-extrabold text-stone-800">{dish.fat}g</div>
                    </div>
                  </div>

                  {/* Dietary & Allergen Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dish.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                    {dish.allergens.map((alg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        Contains: {alg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pairing Footer + TTS Voice Readout */}
                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <Wine className="w-3.5 h-3.5 text-[#E05A47] shrink-0" />
                    <span className="truncate">{dish.pairing}</span>
                  </div>
                  <button
                    onClick={() => speakDish(`${t.name}. ${t.description}`)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 shrink-0"
                    title="Listen to AI Audio Pronunciation (TTS)"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
