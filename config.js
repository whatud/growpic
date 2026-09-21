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

  /* 결제 (2026-09-21 JY 지시: PG 승인 전까지 기존 문찌언니 강의와 같은 방식으로 실제 결제를 받는다)
     주문서 → 기존 수강신청 서버(munzzi-class 의 Apps Script, '수강신청' 탭) → 카드는 결제선생 카톡 결제 링크, 계좌이체는 입금 안내.
     PG 연동 후에는 order.html 의 결제 버튼만 PG 결제창 호출로 바꾼다 */
  PAY: {
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
    PHONE: '010-9619-6788',          // 2026-09-21 JY 지시로 임시 번호. 정식 번호 생기면 교체
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
      PLANS: [
        { ID: 'chageun', NAME: '차근차근 오프라인 밀착반', DESC: '온라인 강의 + 챌린지 + 오프라인 실습 2회', LIST: 3590000, PRICE: 3290000 },
        { ID: 'tantan',  NAME: '탄탄대로 온라인반',       DESC: '온라인 강의 + 챌린지',                   LIST: 3190000, PRICE: 2890000 }
      ],
      URL: 'course-shortform.html'
    },
    {
      ID: 'shortsfighter',
      TYPE: 'free',
      STATUS: 'notify',              /* notify: 상세 페이지 없이 카드에서 바로 알림 신청 */
      CATEGORY: '숏폼 · 무료 라이브',
      TITLE: '쇼츠파이터',
      SUB: '숏폼으로 첫 수익을 내는 법, 무료 라이브 강의',
      TEACHER: '문찌언니',
      THUMB: '',
      COHORT: '2기',
      DATE_TEXT: '10월 22일(목) 무료 라이브',   // 2026-09-21 기준 일정표 웹앱의 무료강의 날짜. 바뀌면 여기만
      FORMAT: '줌 무료 라이브',
      PLANS: [],
      URL: ''
    }
  ]
};

window.GP_FMT = {
  won: function (n) { return Number(n).toLocaleString('ko-KR') + '원'; },
  man: function (n) { return (Number(n) / 10000).toLocaleString('ko-KR') + '만원'; },
  monthly: function (p) { return Math.floor(p / (window.GP.INSTALL_MONTHS || 12)).toLocaleString('ko-KR') + '원'; },
  pct: function (l, p) { return ((l - p) / 10000).toLocaleString('ko-KR') + '만원 할인'; }
};
