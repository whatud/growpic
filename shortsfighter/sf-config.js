/* ============================================================
   쇼츠파이터 랜딩 설정. 날짜·주소·측정 ID는 여기 한 곳만 고친다.
   (가격·반 구성·사업자 정보는 그로우픽 공통 설정 ../config.js 의 PRODUCTS.shortsfighter 에 있다)
   ============================================================ */
window.SF = {
  BRAND: '쇼츠파이터',
  COHORT: '1기',   /* 2026-10-09 정정: 쇼츠파이터는 이번이 1기 (문찌언니 숏폼대행과 다른 강의) */
  TEACHER: '엄부장',
  TEACHER_FULL: '엄성용',

  /* 무료 라이브 일정 (2026-09-27 브리프: 11월 4일 수요일 저녁 7시 30분, 유튜브 라이브) */
  LIVE_DATE: '2026-11-04T19:30:00+09:00',
  LIVE_LABEL: '11월 4일 (수) 저녁 7시 30분',
  LIVE_LABEL_LONG: '11월 4일 수요일 저녁 7시 30분',
  LIVE_HOW: '유튜브 라이브',
  DEADLINE_LABEL: '라이브 시작까지',
  CAPACITY_LABEL: '',                 /* 정원 숫자는 쓰지 않는다 (1기 결정). 비워두면 표시 안 함 */

  /* 측정. 1기 문찌 속성·픽셀을 그대로 쓴다. 새 속성으로 바꾸려면 여기만 교체 */
  GA4_ID: 'G-R8NLNEE48T',
  META_PIXEL_ID: '1061924329776616',

  /* 신청 저장 서버 (Apps Script). 비우면 화면에서만 완료 처리되고 아무 데도 저장되지 않는다.
     form_type 으로 1기 무료특강 신청과 구분한다 (apps_script 에 분기 추가 필요, 미완이면 '신청자' 탭에 섞여 들어감) */
  FORM_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxDC1s8K_dqJBWCYf8czFi7vuH0gdLrxj5ZhsKV4SxXSmiG0Qu282RxvuogvBl_Oq4XcA/exec',   /* 2026-10-09 쇼츠파이터 전용: 시트 '쇼츠파이터 1기 무료 라이브 신청자'(whatud2026), 서버 '쇼츠파이터 1기 신청 서버' */
  FORM_TYPE: 'sf_free_apply',

  /* 이동 주소 */
  THANKS_URL: 'thanks.html',
  COURSE_URL: 'course.html',
  /* 2026-11-04 정규 과정 반·가격 (JY 지시: 라이브 장표 캔바 기준으로 전부 맞춤).
     ../config.js PRODUCTS.shortsfighter.PLANS 대신 이것을 쓴다 (그로우픽 공통 설정은 토스 카드사 심사 중이라 건드리지 않음).
     ⚠️ 바꾸면 서버 apps_script_shortsfighter_v2.gs 의 PRICES 도 같이 바꿔야 결제가 된다 */
  COURSE_NAME: '쇼츠파이터 정규 과정 1기',
  INSTALL_MONTHS: 12,
  PLANS: [
    { ID: 'basic',   NAME: '스탠다드반', LIST: 2490000, PRICE: 2290000, MONTHLY: 190833, DAILY: 6361,
      DESC: '4주 라이브 강의 + 정규 과정 혜택 전부', BONUS: '1:1 줌 피드백 2회권' },
    { ID: 'premium', NAME: '프리미엄반', LIST: 2890000, PRICE: 2690000, MONTHLY: 224166, DAILY: 7472,
      DESC: '스탠다드반 전부 + 1:1 줌 피드백 추가', BONUS: '1:1 줌 피드백 3회권' }
  ],
  /* 당일 결제 특전 마감 (캔바 '오늘 결제하면', '당일결제자 한정'). 지나면 카운트다운만 사라지고 페이지는 열려 있다 */
  PERK_DEADLINE: '2026-11-04T23:59:59+09:00',
  PERK_DEADLINE_LABEL: '11월 4일(수) 밤 12시',
  CLASS_DAYS: ['2026-11-06', '2026-11-13', '2026-11-20', '2026-11-27'],
  CLASS_TIME: '저녁 7시 30분 ~ 9시 30분',

  /* 2026-11-04 정규 과정 결제는 결제선생 반자동(apply.html). 토스 계약·카드사 심사가 끝나면 '../order.html?product=shortsfighter' 로 되돌린다 */
  ORDER_URL: 'apply.html?product=shortsfighter',

  /* 수강 신청 저장 서버. ⚠️ 서버에 수강신청 분기(apps_script_shortsfighter_v2.gs)를 '새 버전'으로 배포한 뒤에만 FORM_ENDPOINT 와 같은 주소를 넣는다.
     비어 있으면 신청 버튼이 실패 화면(카톡·전화 안내)을 띄운다. 옛 서버로 보내면 무료 신청자 탭에 섞이므로 순서를 지킬 것 */
  COURSE_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxDC1s8K_dqJBWCYf8czFi7vuH0gdLrxj5ZhsKV4SxXSmiG0Qu282RxvuogvBl_Oq4XcA/exec',   /* 2026-11-04 15:00 서버 v2(버전 2) 배포 확인 후 연결 */
  KAKAO_CS_URL: '',                   /* 결제 문의용 1:1 카카오 채널 주소. 비우면 전화·문자로 안내 (무료 라이브 오픈채팅은 단체방이라 쓰지 않음) */
  LINK_ETA_TEXT: '',                  /* 결제 링크 도착 예상. 예: '30분 안에'. 비우면 시간 약속 문구를 쓰지 않는다 */
  OPENCHAT_URL: 'https://open.kakao.com/o/gURd2wRi',   /* 2026-10-09 JY: 11.4 엄부장의 쇼츠파이터 무료 라이브 오픈채팅. 비우면 완료 페이지에서 버튼이 숨는다 */
  TEACHER_CHANNEL_URL: '',            /* 엄부장 유튜브 채널. 비우면 완료 페이지에서 버튼이 숨는다 */
  TAMAGOTCHI_URL: '',                 /* 다마고치 채널. 비우면 숨김 */

  /* 무료강의 페이지에 본강의를 미리 노출할지 (브리프 7-5: A 노출 안 함) */
  SHOW_COURSE_ON_FREE: false
};
