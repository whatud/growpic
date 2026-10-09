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
  FORM_ENDPOINT: 'https://script.google.com/macros/s/AKfycbzwNuDWeM9JX8LW1bjf0E6cZHc6wFeq-_k0leH9nYnhzK7dwFKLVj3r_7oQFBOHz-eu/exec',
  FORM_TYPE: 'sf_free_apply',

  /* 이동 주소 */
  THANKS_URL: 'thanks.html',
  COURSE_URL: 'course.html',
  ORDER_URL: '../order.html?product=shortsfighter',
  OPENCHAT_URL: 'https://open.kakao.com/o/gURd2wRi',   /* 2026-10-09 JY: 11.4 엄부장의 쇼츠파이터 무료 라이브 오픈채팅. 비우면 완료 페이지에서 버튼이 숨는다 */
  TEACHER_CHANNEL_URL: '',            /* 엄부장 유튜브 채널. 비우면 완료 페이지에서 버튼이 숨는다 */
  TAMAGOTCHI_URL: '',                 /* 다마고치 채널. 비우면 숨김 */

  /* 무료강의 페이지에 본강의를 미리 노출할지 (브리프 7-5: A 노출 안 함) */
  SHOW_COURSE_ON_FREE: false
};
