よこはま かわさき BENTO MAP　飲食店情報データ
===

項目
----

| 項目名                | 型                | 説明                      | 補足                      |
|:----------------------|:------------------|:--------------------------|:--------------------------|
| type                  | 整数              | タイプ                    | choices=DATA_TYPE_CLASS   |
| category_sel          | 整数              | カテゴリ                  | choices=CATEGORY_CLASS    |
| agreement             | bool              | 承認                      |                           |
| mail                  | 文字列            | メール                    |                           |
| name                  | 文字列            | 店名                      |                           |
| genre_sel             | 整数              | ジャンル                  | choices=GENRE_CLASS       |
| group_sel             | 整数              | グループ                  | choices=GROUP_CLASS       |
| description           | 文字列            | 店舗概要                  |                           |
| addr_sel              | 文字列            | 都道府県                  |                           |
| addr                  | 文字列            | 店舗住所                  |                           |
| area_sel              | 整数              | 店舗の地域                | choices=AREA_CLASS        |
| takeaway_sel          | 整数              | テイクアウト              |                           |
| takeaway_menu         | 文字列(複数行)    | テイクアウトメニュー      |                           |
| takeaway_note         | 文字列(複数行)    | テイクアウト対応          |                           |
| delivery_demaekan     | bool              | 出前館                    |                           |
| delivery_ubereats     | bool              | UberEats（ウーバーイーツ  |                           |
| delivery_own          | bool              | 自店で配達                |                           |
| delivery_other        | bool              | デリバリー・その他        |                           |
| delivery_note         | 文字列(複数行)    | デリバリー対応            |                           |
| phone                 | 文字列            | 電話番号                  |                           |
| open_day              | 文字列(複数行)    | 定休日・営業時間          |                           |
| payment_cash          | bool              | 現金                      |                           |
| payment_card          | bool              | クレジットカード          |                           |
| payment_qr            | bool              | QRコード決済              |                           |
| payment_emoney        | bool              | 電子マネー                |                           |
| payment_note          | 文字列(複数行)    | 支払いノート              |                           |
| website               | 文字列            | ホームページ              |                           |
| twitter               | 文字列            | Twitter                   |                           |
| facebook              | 文字列            | Facebook                  |                           |
| instagram             | 文字列            | Instagram                 |                           |
| line                  | 文字列            | LINE                      |                           |
| sns_other             | 文字列            | SNS、他サイト             |                           |
| transportation        | 文字列(複数行)    | 交通手段                  |                           |
| diet_note             | 文字列(複数行)    | ベジタリアン対応          |                           |
| allergy_note          | 文字列(複数行)    | アレルギー対応            |                           |
| latitude              | float             | 緯度(latitude)            |                           |
| longitude             | float             | 経度(longitude)           |                           |
| covid19_note          | 文字列(複数行)    | コロナ対策                |                           |
| note                  | 文字列(複数行)    | 留意事項                  |                           |
| expired_shop_date     | 日時              | 無効                      |                           |
| closes_shop_date      | 日時              | 休止・閉店                |                           |
| soldout_takeaway_date | 日時              | テイクアウト売り切れ      |                           |
| soldout_delivery_date | 日時              | デリバリー売り切れ        |                           |
| created_date          | 日時              | 作成日                    |                           |
| update_date           | 日時              | 修正日                    |                           |


---

選択項目
----


### データタイプ (DATA_TYPE_CLASS)

    0. オーナー
    1. ユーザー
    -1. ---

### 区分 (IMAGE_DATA_CLASS)

    1. その他
    2. 店舗
    3. テイクアウト
    4. 店舗&テイクアウト
    -1. ---

### ジャンル (GENRE_CLASS)

    1. その他
    2. お弁当・お惣菜
    3. 中華料理
    4. 和食・日本料理・お寿司
    5. ピザ・パスタ
    6. 洋食・西洋料理・とんかつ
    7. 居酒屋・ダイニングバー・焼鳥
    8. アジア・エスニック・カレー
    9. ステーキ・ハンバーグ・焼肉・ホルモン
    10. 創作料理・無国籍料理
    11. ラーメン
    12. カフェ・喫茶店
    13. バー・パブ・ラウンジ
    14. パン・サンドイッチ
    15. スイーツ
    16. スーパーマーケット・コンビニエンスストア
    -1. ジャンルなし

### 地域 (AREA_CLASS)

    1. その他
    2. 武蔵小杉・新丸子・元住吉
    3. 武蔵新城・武蔵中原
    4. 溝の口・梶ヶ谷・鷺沼
    5. 登戸・稲田堤
    6. 川崎・平間
    7. 百合ヶ丘・新百合ヶ丘
    8. 川崎市川崎区
    9. 川崎市幸区
    10. 川崎市中原区
    11. 川崎市高津区
    12. 川崎市宮前区
    13. 川崎市多摩区
    14. 川崎市麻生区
    15. 横浜市青葉区
    16. 横浜市都筑区
    17. 横浜市港北区
    18. 横浜市鶴見区
    19. 横浜市緑区
    20. 横浜市神奈川区
    21. 横浜市瀬谷区
    22. 横浜市旭区
    23. 横浜市保土ケ谷区
    24. 横浜市南区
    25. 横浜市西区
    26. 横浜市中区
    27. 横浜市泉区
    28. 横浜市戸塚区
    29. 横浜市港南区
    30. 横浜市磯子区
    31. 横浜市栄区
    32. 横浜市金沢区
    -1. 地域の指定なし

### カテゴリー (CATEGORY_CLASS)

    1. その他
    2. テイクアウト
    3. デリバリー
    4. テイクアウト&デリバリー
    -1. 指定なし

### テイクアウト（持ち帰り） (TAKEAWAY_CLASS)

    1. その他
    2. 対応している
    3. 対応してない
    4. 準備中
    -1. 指定なし

### グループ(区分) (GROUP_CLASS)

    1. その他
    2. 武蔵小杉カレーフェスティバル
    3. 川崎市内テイクアウト＆デリバリー実施店舗リスト
    4. テイクアウト＆デリバリー横浜
    -1. 指定なし



