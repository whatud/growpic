/* 헤더·푸터·알림 신청 창을 모든 페이지에 똑같이 붙인다.
   푸터 사업자 정보는 config.js 의 GP.BIZ 에서만 읽는다 */
(function () {
  var G = window.GP, B = G.BIZ;

  /* 로고: G1 확정 (2026-09-21). 원본 생성은 _font/build_logo_g1.py → assets/logo/ */
  var LOGO = '<img src="assets/logo/logo_light.svg" alt="그로우픽">';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function need(v) { return v ? esc(v) : '<span class="todo">확인 필요</span>'; }

  var header = document.getElementById('gh');
  if (header) {
    header.className = 'gh';
    header.innerHTML = '<div class="wrap"><a class="gh-logo" href="index.html">' + LOGO + '</a>' +
      '<nav><a href="index.html#classes">클래스</a></nav></div>';
  }

  var footer = document.getElementById('gf');
  if (footer) {
    footer.className = 'gf';
    footer.innerHTML = '<div class="wrap">' +
      '<div class="links"><a href="terms.html">이용약관</a><a class="strong" href="privacy.html">개인정보처리방침</a><a href="refund.html">환불규정</a>' +
      '<a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=' + B.BIZ_NO_RAW + '" target="_blank" rel="noopener">사업자정보확인</a></div>' +
      '<div class="biz">' +
      '<span>상호 ' + esc(B.COMPANY) + '</span><span>대표자 ' + esc(B.CEO) + '</span>' +
      '<span>사업자등록번호 ' + esc(B.BIZ_NO) + '</span><span>통신판매업 신고번호 ' + esc(B.SALES_NO) + '</span><br>' +
      '<span>사업장 주소 ' + esc(B.ADDRESS) + '</span><br>' +
      '<span>고객센터 ' + need(B.PHONE) + '</span><span>이메일 ' + esc(B.EMAIL) + '</span><span>상담 ' + esc(B.CS_HOURS) + '</span><br>' +
      '<span>개인정보보호책임자 ' + esc(B.PRIVACY_OFFICER) + '</span><span>호스팅 서비스 제공자 ' + esc(B.HOSTING) + '</span>' +
      '</div>' +
      '<p class="copy">' + esc(G.SITE) + '는 ' + esc(B.COMPANY) + '가 운영하는 교육 서비스입니다. © ' + new Date().getFullYear() + ' ' + esc(B.COMPANY) + '. All rights reserved.</p>' +
      '</div>';
  }

  /* ---- 알림 신청 창 ---- */
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="nm-t"><div style="position:relative">' +
    '<button class="close" type="button" aria-label="닫기">×</button>' +
    '<form id="nf" novalidate>' +
    '<h4 id="nm-t">다음 기수 오픈 알림 신청</h4>' +
    '<p class="desc">모집이 열리면 카카오톡(문자)으로 가장 먼저 알려드립니다.</p>' +
    '<div class="fld"><label for="nf-name">이름</label><input id="nf-name" name="name" autocomplete="name" required></div>' +
    '<div class="fld"><label for="nf-phone">휴대폰 번호</label><input id="nf-phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000" required></div>' +
    '<div class="fld"><label for="nf-plan">관심 있는 반</label><select id="nf-plan" name="plan"></select></div>' +
    '<label class="agree"><input type="checkbox" id="nf-agree"> <span>[필수] 개인정보 수집·이용에 동의합니다. 이름·휴대폰 번호를 모집 알림 발송에만 쓰고, 발송 후 6개월 뒤 파기합니다. <a href="privacy.html" target="_blank">자세히</a></span></label>' +
    '<p class="err" id="nf-err"></p>' +
    '<button class="btn block" type="submit">알림 신청하기</button>' +
    '</form>' +
    '<div id="nf-done" style="display:none;text-align:center;padding:10px 0">' +
    '<div class="done-ico" style="margin:0 auto 14px"><svg width="28" height="28" viewBox="0 0 22 22"><path d="M6 11.5l3.2 3.2L16 8" fill="none" stroke="#007A51" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
    '<h4>알림 신청이 완료됐습니다</h4><p class="desc">모집이 열리면 입력하신 번호로 안내드리겠습니다.</p>' +
    '<button class="btn line block" type="button" style="margin-top:20px" data-close>확인</button></div>' +
    '</div></div>';
  document.body.appendChild(modal);

  var curProduct = null;
  function openNotify(pid, planId) {
    var p = G.PRODUCTS.filter(function (x) { return x.ID === pid; })[0] || G.PRODUCTS[0];
    curProduct = p;
    var sel = modal.querySelector('#nf-plan');
    var opts = p.PLANS.length ? p.PLANS.map(function (pl) { return '<option value="' + pl.ID + '"' + (pl.ID === planId ? ' selected' : '') + '>' + esc(pl.NAME) + '</option>'; }).join('') : '';
    sel.innerHTML = opts + '<option value="undecided">아직 모르겠어요</option>';
    modal.querySelector('#nm-t').textContent = p.TITLE + ' ' + p.COHORT + ' 오픈 알림 신청';
    modal.querySelector('#nf').style.display = '';
    modal.querySelector('#nf-done').style.display = 'none';
    modal.querySelector('#nf-err').textContent = '';
    modal.classList.add('open');
    setTimeout(function () { modal.querySelector('#nf-name').focus(); }, 30);
  }
  function close() { modal.classList.remove('open'); }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.close') || e.target.hasAttribute('data-close')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  modal.querySelector('#nf').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = modal.querySelector('#nf-name').value.trim();
    var phone = modal.querySelector('#nf-phone').value.replace(/[^0-9]/g, '');
    var err = modal.querySelector('#nf-err');
    if (!name) { err.textContent = '이름을 입력해 주세요.'; return; }
    if (!/^01[016789][0-9]{7,8}$/.test(phone)) { err.textContent = '휴대폰 번호를 다시 확인해 주세요.'; return; }
    if (!modal.querySelector('#nf-agree').checked) { err.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    var data = { form_type: 'notify', product: curProduct.ID, cohort: curProduct.COHORT, plan: modal.querySelector('#nf-plan').value, name: name, phone: phone, page: location.pathname, ts: new Date().toISOString() };
    function done() { modal.querySelector('#nf').style.display = 'none'; modal.querySelector('#nf-done').style.display = ''; }
    if (!G.NOTIFY_ENDPOINT) { done(); return; }          // 서버 주소 전: 화면만 완료 처리
    fetch(G.NOTIFY_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) }).then(done, function () { err.textContent = '전송이 안 됐습니다. 잠시 후 다시 시도해 주세요.'; });
  });

  window.GP_openNotify = openNotify;
})();
