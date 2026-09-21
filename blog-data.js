/* ============================================================
   블로그 글 목록. 강사가 쓴 글은 POSTS 에 한 칸씩 추가한다 (최신 글을 맨 위에).
   사진은 assets/blog/ 폴더에 넣고 경로를 적는다.
   body 는 문단 배열: 문자열 = 문단, {h:'소제목'}, {img:'경로', cap:'사진 설명'}
   ============================================================ */
window.GP_POSTS = [
  /* 예)
  { id: 'first-contract', cat: '숏폼 대행', title: '첫 계약은 이렇게 따냈습니다', author: '문찌언니', avatar: 'assets/teacher.webp',
    date: '2026-10-01', cover: 'assets/blog/first-contract.jpg', excerpt: '목록에 보일 두 줄 요약',
    body: ['첫 문단', {h: '소제목'}, {img: 'assets/blog/xxx.jpg', cap: '사진 설명'}, '다음 문단'] },
  */
];

/* 주소 끝에 ?preview=1 을 붙였을 때만 보이는 예시 글 (디자인 확인용. 실제 공개 화면엔 안 나온다) */
window.GP_SAMPLE_POSTS = [
  { id: 'sample-1', cat: '숏폼 대행', title: '[예시] 첫 대행 계약서를 쓰기 전에 확인한 다섯 가지', author: '문찌언니', avatar: 'assets/teacher.webp',
    date: '2026-09-28', cover: '', excerpt: '강사가 쓴 글이 이런 모양으로 목록에 올라옵니다. 제목은 두 줄까지, 요약은 두 줄까지 보입니다.',
    body: ['블로그 글 본문은 이렇게 보입니다. 강사가 글과 사진을 보내주면 이 틀에 그대로 들어갑니다.',
           {h: '소제목은 이렇게 보입니다'},
           '문단 사이 간격과 글자 크기는 휴대폰에서 읽기 편하게 맞춰 두었습니다.',
           {img: '', cap: '사진이 들어갈 자리와 사진 설명'},
           '마지막 문단입니다.'] },
  { id: 'sample-2', cat: '수강 후기', title: '[예시] 1기 수강생 인터뷰가 들어갈 자리', author: '그로우픽', avatar: '',
    date: '2026-09-25', cover: '', excerpt: '카테고리는 숏폼 대행, 수강 후기, 공지처럼 자유롭게 정할 수 있습니다.', body: ['예시 본문입니다.'] },
  { id: 'sample-3', cat: '공지', title: '[예시] 무료 강의 일정 공지', author: '그로우픽', avatar: '',
    date: '2026-09-22', cover: '', excerpt: '공지 글도 같은 목록에 섞여 올라갑니다.', body: ['예시 본문입니다.'] }
];

window.GP_postsForView = function () {
  var preview = /[?&]preview=1/.test(location.search);
  return preview ? window.GP_POSTS.concat(window.GP_SAMPLE_POSTS) : window.GP_POSTS;
};
