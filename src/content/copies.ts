import type { TenchusatsuKind } from "../domain/pillar";

export type Copy = {
  kind: TenchusatsuKind;
  title: string;
  lead: string;
  thin: readonly [string, string];
  valued: readonly [string, string];
  scene: string;
  question: string;
  people: readonly [string, string, string];
};

const COPIES: Record<TenchusatsuKind, Copy> = {
  子丑: {
    kind: "子丑",
    title: "子丑天中殺",
    lead: "目上との縁よりも、目下との縁を大切にする。",
    thin: ["父や上司の用事は後回しになりやすい。", "先輩に相談されても深入りしない。"],
    valued: ["後輩が困っていると自分から動く。", "年下の話は最後まで聞く。"],
    scene: "上司の話は聞き流す。後輩が失敗した話だと自分から理由を聞く。",
    question: "最近、年下に頼まれて引き受けたことは何だ？",
    people: ["綾瀬はるか", "明石家さんま", "タモリ"],
  },
  寅卯: {
    kind: "寅卯",
    title: "寅卯天中殺",
    lead: "友人や兄弟との縁よりも、家庭との縁を大切にする。",
    thin: ["友人の誘いは後回しにする。", "兄弟の近況は聞き流す。"],
    valued: ["配偶者の話は最後まで聞く。", "家の予定は自分から入れる。"],
    scene: "友人の近況は流す。家の話になると具体的になる。",
    question: "今日の話を家に帰って誰にする？",
    people: ["木村拓哉", "宇多田ヒカル", "福山雅治"],
  },
  辰巳: {
    kind: "辰巳",
    title: "辰巳天中殺",
    lead: "気持ちを話すことよりも、実行することを大切にする。",
    thin: ["気持ちの吐露は短く終える。", "なぜそう感じるかは後回しにする。"],
    valued: ["次に何をするかは自分から決める。", "作業の話になると自分から口を出す。"],
    scene: "気持ちの話が続くと席を外したくなる。次に何をするかの話になると前に出る。",
    question: "今の話を次にやるのはいつだ？",
    people: ["新垣結衣", "石原さとみ", "浜崎あゆみ"],
  },
  午未: {
    kind: "午未",
    title: "午未天中殺",
    lead: "目下との縁よりも、目上との縁を大切にする。",
    thin: ["後輩の相談は短く終える。", "年下の失敗には深入りしない。"],
    valued: ["上司の評価は覚えている。", "父や先輩の話は最後まで聞く。"],
    scene: "後輩の相談は短く切る。上司の話になると内容を覚えている。",
    question: "上司か先輩にその件を伝えるとき、最初の一言は何だ？",
    people: ["大谷翔平", "橋本環奈", "松本潤"],
  },
  申酉: {
    kind: "申酉",
    title: "申酉天中殺",
    lead: "家庭との縁よりも、友人や兄弟との縁を大切にする。",
    thin: ["配偶者の話は短く終える。", "家の予定は後回しにする。"],
    valued: ["友人の誘いは自分から受ける。", "兄弟の近況は最後まで聞く。"],
    scene: "家の話は一文で終える。友人の話題だと自分から広げる。",
    question: "その話を最初に伝える友達は誰だ？",
    people: ["米津玄師", "安室奈美恵", "二宮和也"],
  },
  戌亥: {
    kind: "戌亥",
    title: "戌亥天中殺",
    lead: "実行することよりも、気持ちを話すことを大切にする。",
    thin: ["次に何をするかの段取りは後回しにする。", "作業の話は短く終える。"],
    valued: ["なぜそう感じるかは自分から聞く。", "気持ちの話だと最後までいる。"],
    scene: "段取りの話は後回しにする。気持ちの話だと長くいる。",
    question: "その件のどこに納得していない？",
    people: ["菅田将暉", "有村架純", "平野紫耀"],
  },
};

export function copyFor(kind: TenchusatsuKind): Copy {
  return COPIES[kind];
}
