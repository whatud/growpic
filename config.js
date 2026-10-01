/* ============================================================
   그로우픽 공통 설정. 모든 페이지가 이 파일 하나를 읽는다.
   사업자 정보·가격·판매 모드는 여기만 고친다 (페이지 본문에 직접 적지 말 것)
   ============================================================ */
window.GP = {
  SITE: '그로우픽',
  SLOGAN: '성장을 위한 교육을 선택하다',

  /* 판매 모드
     'notify' : 가격은 보여주되 버튼은 '다음 기수 알림 신청' (지금)
     'sale'   : 버튼이 '수강 신청하기' → 주문서(order.html)로 이어진다.
                ⚠️ PG 심사 기간에는 'sale' 로 두는 것을 권장. 심사자가 결제 흐름을 눌러보기 때문 */
  MODE: 'sale',     // 2026-09-21 PG 심사 대비 판매 모드. 승인 후 'notify' 로 되돌릴 것

  /* 가격 표기 (2026-09-21 제안서 R3): 정가로 판 적이 없는데 '정가·할인'을 상시로 붙이면 표시광고법 종전가격 기준에 걸릴 수 있어
     판매가만 보인다. 기간 한정 할인을 할 때만 true 로 바꾸고 기간·사유를 페이지에 함께 적을 것 */
  SHOW_LIST: false,
  INSTALL_MONTHS: 12,             /* 수강료 옆 '월 ○원' 할부 안내 (S5). 카드사 할부 수수료는 별도 */

  /* 카드사 심사 기간 숨김 (2026-10-01): 토스 기준 '0원 상품은 심사 불가, 카테고리마다 결제 가능한 상품 1개 이상'.
     무료 강의(쇼츠파이터 무료 라이브)와 그 카테고리를 심사 끝날 때까지 숨긴다. 심사 통과 후 [] 로 비우면 다시 보인다.
     ⚠️ 심사 중에는 상품 카테고리·하단 사업자정보·판매 상태를 바꾸면 반려되므로 이 값을 건드리지 말 것 */
  REVIEW_HIDE: ['shortsfighter'],

  /* 결제 방식
     PAY.MODE 'toss'   : 주문서 안에 토스페이먼츠 결제위젯 → 결제 서버(Cloud Run growpick-pay)가 승인 (2026-10-01~)
     PAY.MODE 'manual' : 예전 방식. 기존 수강신청 서버(Apps Script)로 신청만 받고 결제선생 카톡 링크·계좌이체 안내 */
  PAY: {
    MODE: 'toss',
    TOSS_CLIENT_KEY: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',   // ⚠️ 토스 공개 테스트 키. 계약 후 개발자센터 '결제위젯 연동 키 > 클라이언트 키(live_gck_…)'로 교체
    SERVER: 'https://growpick-pay-1038901444358.asia-northeast3.run.app',   // 시크릿 키는 이 서버 환경변수에만 있다
    ENDPOINT: 'https://script.google.com/macros/s/AKfycbzwNuDWeM9JX8LW1bjf0E6cZHc6wFeq-_k0leH9nYnhzK7dwFKLVj3r_7oQFBOHz-eu/exec',
    COURSE_ID: 'shortform_agency_2',        // 시트 '과정ID' 칸에 남는 값 (1기는 shortform_agency_1)
    LINK_ETA: '10분',
    BANK: { NAME: '국민은행', NUMBER: '61250101461028', HOLDER: '문지영' }
  },

  /* 알림 신청을 받을 주소 (Apps Script 웹앱). 비어 있으면 화면에서만 완료 처리되고 아무 데도 저장되지 않는다 */
  NOTIFY_ENDPOINT: '',

  /* 법적 필수 표기. 사업자등록증과 한 글자도 다르면 안 된다 (심사 반려 1순위) */
  BIZ: {
    COMPANY: '매니샵',
    CEO: '문지영',
    BIZ_NO: '351-65-00566',
    BIZ_NO_RAW: '3516500566',
    SALES_NO: '2025-별내-2042',
    ADDRESS: '경기도 남양주시 순화궁로 418 현대그리너리캠퍼스 별내별가람역 1303호',
    PHONE: '010-4649-6788',          // 2026-10-01 JY 지시. ⚠️ 카드사 심사 중 변경 금지 (바꾸면 반려)
    EMAIL: 'nany418@naver.com',
    PRIVACY_OFFICER: '문지영',
    HOSTING: 'GitHub Pages',
    CS_HOURS: '평일 10:00 ~ 18:00 (주말·공휴일 휴무)'
  },

  PRODUCTS: [
    {
      ID: 'shortform-agency',
      TYPE: 'paid',                  /* paid: 유료 강의 / free: 무료 강의 (클래스 페이지 탭 구분) */
      STATUS: 'open',                /* open: 판매·알림 / soon: 준비 중 카드만 */
      CATEGORY: '숏폼 · 부업',
      TITLE: '숏폼대행 마스터',
      SUB: '영상 몰라도 시작하는 숏폼 대행 실전 5주 과정',
      TEACHER: '문찌언니',
      THUMB: 'assets/teacher.webp',
      COHORT: '2기',
      FORMAT: '줌 라이브 5회 + 녹화본 3개월 다시보기',
      /* 토스 심사 기준 '서비스 제공기간' = 결제 시점부터 서비스가 끝날 때까지의 최대 기간 (1년 넘으면 결제 불가).
         개강 대기 최대 2개월 + 라이브 5주 + 녹화본 3개월 ≒ 6개월. 2기 일정이 정해지면 문지영님 확인 후 갱신 */
      SERVICE_PERIOD: '결제일로부터 최대 6개월 (개강 대기 최대 2개월, 라이브 5주, 녹화본 다시보기 3개월 포함)',
      PLANS: [
        { ID: 'chageun', NAME: '차근차근 오프라인 밀착반', DESC: '온라인 강의 + 챌린지 + 오프라인 실습 2회', LIST: 3590000, PRICE: 3290000 },
        { ID: 'tantan',  NAME: '탄탄대로 온라인반',       DESC: '온라인 강의 + 챌린지',                   LIST: 3190000, PRICE: 2890000 }
      ],
      URL: 'course-shortform.html'
    },
    {
      ID: 'shortsfighter',
      TYPE: 'free',                  /* 카드에는 무료 라이브로 보인다. 결제(정규 과정)는 shortsfighter/course.html → order.html */
      STATUS: 'open',                /* open + URL: 카드가 랜딩으로 이어진다 (notify 모달 대신) */
      CATEGORY: '유튜브 쇼츠 · 무료 라이브',
      TITLE: '쇼츠파이터',
      SUB: '쇼츠는 편집이 아니라 소재예요. 지금 돌아가는 채널을 열어서 보여드리는 무료 라이브',
      TEACHER: '엄부장',
      THUMB: '',
      COHORT: '2기',
      DATE_TEXT: '10월 28일(수) 저녁 8시 무료 라이브',   // 2026-09-27 브리프 기준. 바뀌면 여기와 shortsfighter/sf-config.js 둘 다
      FORMAT: '유튜브 라이브 (정규 과정은 4회 + 1년 수강)',
      COURSE_ID: 'shortsfighter_2',  /* 시트 '과정ID' 칸. 주문서가 이 값을 쓴다 */
      PLANS: [
        { ID: 'basic',   NAME: '일반반',   DESC: '4회 강의 + 1:1 톡 피드백 + 소재 리스트 + 단톡방과 녹화본 12개월', LIST: 2290000, PRICE: 2290000 },
        { ID: 'premium', NAME: '프리미엄반', DESC: '일반반 전부 + 1:1 줌 피드백 5회 (톡으로는 부족한 세세한 부분까지)', LIST: 2890000, PRICE: 2890000 }
      ],
      URL: 'shortsfighter/index.html'
    }
  ]
};

/* 지금 사이트에 보여줄 상품 (심사 기간 숨김 반영) */
window.GP_visible = function () {
  var hide = window.GP.REVIEW_HIDE || [];
  return window.GP.PRODUCTS.filter(function (p) { return hide.indexOf(p.ID) < 0; });
};

window.GP_FMT = {
  won: function (n) { return Number(n).toLocaleString('ko-KR') + '원'; },
  man: function (n) { return (Number(n) / 10000).toLocaleString('ko-KR') + '만원'; },
  monthly: function (p) { return Math.floor(p / (window.GP.INSTALL_MONTHS || 12)).toLocaleString('ko-KR') + '원'; },
  pct: function (l, p) { return ((l - p) / 10000).toLocaleString('ko-KR') + '만원 할인'; }
};
