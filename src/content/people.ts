import type { TenchusatsuKind } from "../domain/pillar";

export type FamousPerson = {
  name: string;
  birthDate: string;
  field: string;
  role: string;
  country: string;
};

// 出典・公表暦日の照合記録: docs/content/famous-people-sources.md
const PEOPLE: Record<TenchusatsuKind, readonly FamousPerson[]> = {
  "子丑": [
    {
      "name": "綾瀬はるか",
      "birthDate": "1985-03-24",
      "field": "映像・舞台",
      "role": "俳優",
      "country": "日本"
    },
    {
      "name": "明石家さんま",
      "birthDate": "1955-07-01",
      "field": "お笑い",
      "role": "お笑い芸人・司会者",
      "country": "日本"
    },
    {
      "name": "タモリ",
      "birthDate": "1945-08-22",
      "field": "お笑い",
      "role": "タレント・司会者",
      "country": "日本"
    },
    {
      "name": "ロジャー・フェデラー",
      "birthDate": "1981-08-08",
      "field": "スポーツ",
      "role": "テニス",
      "country": "スイス"
    },
    {
      "name": "スティーブ・ジョブズ",
      "birthDate": "1955-02-24",
      "field": "ビジネス",
      "role": "Apple共同創業者",
      "country": "米国"
    },
    {
      "name": "アデル",
      "birthDate": "1988-05-05",
      "field": "音楽",
      "role": "シンガーソングライター",
      "country": "英国"
    },
    {
      "name": "マララ・ユスフザイ",
      "birthDate": "1997-07-12",
      "field": "社会活動",
      "role": "教育活動家",
      "country": "パキスタン"
    }
  ],
  "寅卯": [
    {
      "name": "木村拓哉",
      "birthDate": "1972-11-13",
      "field": "映像・舞台",
      "role": "俳優・歌手",
      "country": "日本"
    },
    {
      "name": "宇多田ヒカル",
      "birthDate": "1983-01-19",
      "field": "音楽",
      "role": "シンガーソングライター",
      "country": "日本"
    },
    {
      "name": "福山雅治",
      "birthDate": "1969-02-06",
      "field": "音楽",
      "role": "シンガーソングライター・俳優",
      "country": "日本"
    },
    {
      "name": "リオネル・メッシ",
      "birthDate": "1987-06-24",
      "field": "スポーツ",
      "role": "サッカー",
      "country": "アルゼンチン"
    },
    {
      "name": "マーク・ザッカーバーグ",
      "birthDate": "1984-05-14",
      "field": "ビジネス",
      "role": "Facebook共同創業者",
      "country": "米国"
    },
    {
      "name": "テイラー・スウィフト",
      "birthDate": "1989-12-13",
      "field": "音楽",
      "role": "シンガーソングライター",
      "country": "米国"
    },
    {
      "name": "リアーナ",
      "birthDate": "1988-02-20",
      "field": "音楽",
      "role": "歌手・起業家",
      "country": "バルバドス"
    }
  ],
  "辰巳": [
    {
      "name": "新垣結衣",
      "birthDate": "1988-06-11",
      "field": "映像・舞台",
      "role": "俳優",
      "country": "日本"
    },
    {
      "name": "石原さとみ",
      "birthDate": "1986-12-24",
      "field": "映像・舞台",
      "role": "俳優",
      "country": "日本"
    },
    {
      "name": "浜崎あゆみ",
      "birthDate": "1978-10-02",
      "field": "音楽",
      "role": "歌手",
      "country": "日本"
    },
    {
      "name": "ウサイン・ボルト",
      "birthDate": "1986-08-21",
      "field": "スポーツ",
      "role": "陸上・短距離",
      "country": "ジャマイカ"
    },
    {
      "name": "ベルナール・アルノー",
      "birthDate": "1949-03-05",
      "field": "ビジネス",
      "role": "LVMHの経営者",
      "country": "フランス"
    },
    {
      "name": "セリーヌ・ディオン",
      "birthDate": "1968-03-30",
      "field": "音楽",
      "role": "歌手",
      "country": "カナダ"
    },
    {
      "name": "IU（アイユー）",
      "birthDate": "1993-05-16",
      "field": "音楽",
      "role": "歌手・俳優",
      "country": "韓国"
    }
  ],
  "午未": [
    {
      "name": "大谷翔平",
      "birthDate": "1994-07-05",
      "field": "スポーツ",
      "role": "野球",
      "country": "日本"
    },
    {
      "name": "橋本環奈",
      "birthDate": "1999-02-03",
      "field": "映像・舞台",
      "role": "俳優",
      "country": "日本"
    },
    {
      "name": "松本潤",
      "birthDate": "1983-08-30",
      "field": "映像・舞台",
      "role": "俳優・歌手",
      "country": "日本"
    },
    {
      "name": "マイケル・ジョーダン",
      "birthDate": "1963-02-17",
      "field": "スポーツ",
      "role": "バスケットボール",
      "country": "米国"
    },
    {
      "name": "シャキーラ",
      "birthDate": "1977-02-02",
      "field": "音楽",
      "role": "シンガーソングライター",
      "country": "コロンビア"
    },
    {
      "name": "セルゲイ・ブリン",
      "birthDate": "1973-08-21",
      "field": "ビジネス",
      "role": "Google共同創業者",
      "country": "米国"
    },
    {
      "name": "ポン・ジュノ",
      "birthDate": "1969-09-14",
      "field": "映像・舞台",
      "role": "映画監督",
      "country": "韓国"
    }
  ],
  "申酉": [
    {
      "name": "米津玄師",
      "birthDate": "1991-03-10",
      "field": "音楽",
      "role": "シンガーソングライター",
      "country": "日本"
    },
    {
      "name": "安室奈美恵",
      "birthDate": "1977-09-20",
      "field": "音楽",
      "role": "歌手",
      "country": "日本"
    },
    {
      "name": "二宮和也",
      "birthDate": "1983-06-17",
      "field": "映像・舞台",
      "role": "俳優・歌手",
      "country": "日本"
    },
    {
      "name": "クリスティアーノ・ロナウド",
      "birthDate": "1985-02-05",
      "field": "スポーツ",
      "role": "サッカー",
      "country": "ポルトガル"
    },
    {
      "name": "ラファエル・ナダル",
      "birthDate": "1986-06-03",
      "field": "スポーツ",
      "role": "テニス",
      "country": "スペイン"
    },
    {
      "name": "フレディ・マーキュリー",
      "birthDate": "1946-09-05",
      "field": "音楽",
      "role": "Queenのボーカリスト",
      "country": "英国"
    },
    {
      "name": "サラ・ブレイクリー",
      "birthDate": "1971-02-27",
      "field": "ビジネス",
      "role": "SPANX創業者",
      "country": "米国"
    }
  ],
  "戌亥": [
    {
      "name": "菅田将暉",
      "birthDate": "1993-02-21",
      "field": "映像・舞台",
      "role": "俳優・歌手",
      "country": "日本"
    },
    {
      "name": "有村架純",
      "birthDate": "1993-02-13",
      "field": "映像・舞台",
      "role": "俳優",
      "country": "日本"
    },
    {
      "name": "平野紫耀",
      "birthDate": "1997-01-29",
      "field": "音楽",
      "role": "歌手・俳優",
      "country": "日本"
    },
    {
      "name": "ノバク・ジョコビッチ",
      "birthDate": "1987-05-22",
      "field": "スポーツ",
      "role": "テニス",
      "country": "セルビア"
    },
    {
      "name": "キム・ヨナ",
      "birthDate": "1990-09-05",
      "field": "スポーツ",
      "role": "フィギュアスケート",
      "country": "韓国"
    },
    {
      "name": "レディー・ガガ",
      "birthDate": "1986-03-28",
      "field": "音楽",
      "role": "歌手・俳優",
      "country": "米国"
    },
    {
      "name": "カルロス・スリム",
      "birthDate": "1940-01-28",
      "field": "ビジネス",
      "role": "実業家",
      "country": "メキシコ"
    }
  ]
};

export function peopleFor(kind: TenchusatsuKind): readonly FamousPerson[] {
  return PEOPLE[kind];
}
