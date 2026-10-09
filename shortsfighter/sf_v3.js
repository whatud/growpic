/* sf_v3.js : sf.js 를 바탕으로 2026-10-06 v3 랜딩용으로 만든 사본. 전송은 서버 {ok:true} 확인 후 완료 */
/* ============================================================
   쇼츠파이터 랜딩 공통 스크립트
   - 유입 귀속(90일 first-touch, localStorage 'sf_attr')
   - GA4 / 메타 픽셀 로드 (ID 비우면 조용히 꺼짐)
   - 일정 문구 채우기, 카운트다운, 하단 고정 바
   - 신청 폼 검증·전송 (confirmedSubmit: 서버가 {ok:true} 로 답해야 완료, 실패 시 다시 보내기·문자·입력 내용)
   - 등장 애니메이션, 구간 노출·스크롤 깊이 측정
   ============================================================ */
(function(){
  'use strict';
  var CFG = window.SF || {};
  var GP = window.GP || null;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  var isPC = function(){ return matchMedia('(min-width:1240px)').matches; };
  var LOCAL = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  window.SF_LOCAL = LOCAL;
  var NOTRACK = LOCAL;
  try{ if(/[?&]sftest=1/.test(location.search)) sessionStorage.setItem('sf_test','1'); NOTRACK = NOTRACK || sessionStorage.getItem('sf_test')==='1'; }catch(e){}
  window.SF_NOTRACK = NOTRACK;

  /* ===== 측정 태그 ===== */
  (function(){
    var id = CFG.GA4_ID;
    if(!id || NOTRACK){ window.gtag = function(){ if(window.SF_DEBUG) console.log('[gtag:off]', arguments); }; return; }
    var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+id; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)};
    gtag('js', new Date()); gtag('config', id);
  })();
  (function(f,b,e,v,n,t,s){
    var id = CFG.META_PIXEL_ID;
    if(!id || NOTRACK){ window.fbq = function(){ if(window.SF_DEBUG) console.log('[fbq:off]', arguments); }; return; }
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    fbq('init', id); fbq('track', 'PageView');
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  /* ===== 유입 귀속 =====
     1기 규칙 그대로: UTM이 붙은 첫 방문을 90일 고정(first-touch). 기존 기록이 direct/referral 뿐이면 UTM 방문이 대체.
     1기 교훈: 카톡방·라이브 설명란 링크는 인앱 브라우저로 열려 저장소가 비어 있었다.
     그래서 공유하는 모든 링크에 utm_source(kakao_room / live_desc 등)를 붙이고,
     결제 페이지·주문서로 넘길 때 귀속값을 주소에 실어 보낸다(carryAttr). */
  var UTM_KEYS=['utm_source','utm_medium','utm_campaign','utm_content'];
  var ATTR_KEY='sf_attr', ATTR_TTL=90*864e5;
  var ATTR=(function(){
    function save(o){ try{ localStorage.setItem(ATTR_KEY, JSON.stringify(o)); }catch(e){} }
    var now=Date.now(), q=new URLSearchParams(location.search), cur={}, hasUTM=false;
    UTM_KEYS.forEach(function(k){ var v=q.get(k); if(v){ cur[k]=v.toLowerCase().slice(0,80); hasUTM=true; } });
    /* 결제 페이지로 넘어올 때 attr_* 로 실어 보낸 값도 UTM 처럼 받는다 */
    if(!hasUTM && q.get('attr_source')){ cur.utm_source=q.get('attr_source'); cur.utm_medium=q.get('attr_medium')||''; cur.utm_campaign=q.get('attr_campaign')||''; hasUTM=true; }
    var saved=null;
    try{ var raw=localStorage.getItem(ATTR_KEY); if(raw){ var p=JSON.parse(raw); if(p&&p.first_seen&&(now-Date.parse(p.first_seen))<ATTR_TTL) saved=p; } }catch(e){}
    if(saved && saved.locked){ saved.visits=(saved.visits||1)+1; if(hasUTM) saved.last_source=cur.utm_source||''; save(saved); return saved; }
    if(!saved || hasUTM){
      var rec={ utm_source:cur.utm_source||'', utm_medium:cur.utm_medium||'', utm_campaign:cur.utm_campaign||'', utm_content:cur.utm_content||'',
        referrer:document.referrer||'', first_seen:new Date().toISOString(), visits:(saved&&saved.visits?saved.visits+1:1), locked:hasUTM };
      if(!rec.utm_source){
        if(rec.referrer){ try{ rec.utm_source=new URL(rec.referrer).hostname.replace(/^www\./,''); rec.utm_medium='referral'; }catch(e){ rec.utm_source='direct'; rec.utm_medium='none'; } }
        else { rec.utm_source='direct'; rec.utm_medium='none'; }
      }
      rec.last_source=rec.utm_source; save(rec); return rec;
    }
    saved.visits=(saved.visits||1)+1; save(saved); return saved;
  })();
  function attribution(){
    return { utm_source:ATTR.utm_source||'', utm_medium:ATTR.utm_medium||'', utm_campaign:ATTR.utm_campaign||'', utm_content:ATTR.utm_content||'',
      referrer:ATTR.referrer||'', first_seen:ATTR.first_seen||'', visits:ATTR.visits||1, last_source:ATTR.last_source||'',
      device: innerWidth<768?'mobile':'desktop' };
  }
  function carryAttr(url){
    try{
      var u=new URL(url, location.href);
      if(ATTR.utm_source){ u.searchParams.set('attr_source',ATTR.utm_source); u.searchParams.set('attr_medium',ATTR.utm_medium||''); u.searchParams.set('attr_campaign',ATTR.utm_campaign||''); }
      return u.pathname+u.search+u.hash;
    }catch(e){ return url; }
  }
  function track(n,p){
    p=p||{}; p.attr_source=ATTR.utm_source||''; p.attr_medium=ATTR.utm_medium||''; p.attr_campaign=ATTR.utm_campaign||''; p.cohort='shortsfighter_2';
    if(window.gtag) window.gtag('event',n,p);
    if(window.SF_DEBUG||LOCAL) console.log('[track]',n,p);
  }
  window.SF_track=track; window.SF_attr=attribution; window.SF_carry=carryAttr;

  /* ===== 일정 문구 ===== */
  (function(){
    $$('[data-live-label]').forEach(function(e){ e.textContent=CFG.LIVE_LABEL||''; });
    $$('[data-live-long]').forEach(function(e){ e.textContent=CFG.LIVE_LABEL_LONG||''; });
    $$('[data-live-how]').forEach(function(e){ e.textContent=CFG.LIVE_HOW||''; });
    var sched = (CFG.LIVE_LABEL_LONG||'')+' 시작, '+(CFG.LIVE_HOW||'')+(CFG.CAPACITY_LABEL?', '+CFG.CAPACITY_LABEL:'');
    $$('[data-schedule]').forEach(function(e){ e.textContent=sched; });
    var short=(CFG.LIVE_LABEL||'').replace(/\s*\(.\)\s*/,' ');
    $$('[data-live-short]').forEach(function(e){ e.textContent=short; });
    /* 주소 링크: 귀속값 실어 보내기 */
    $$('[data-course-link]').forEach(function(a){ a.href=carryAttr(CFG.COURSE_URL||'course.html'); });
    $$('[data-order-link]').forEach(function(a){
      var base=CFG.ORDER_URL||'../order.html?product=shortsfighter'; var plan=a.getAttribute('data-plan');
      a.href=carryAttr(base+(plan?'&plan='+plan:''));
    });
    $$('[data-openchat]').forEach(function(a){ if(CFG.OPENCHAT_URL){ a.href=CFG.OPENCHAT_URL; } else { a.style.display='none'; } });
    $$('[data-teacher-channel]').forEach(function(a){ if(CFG.TEACHER_CHANNEL_URL){ a.href=CFG.TEACHER_CHANNEL_URL; } else { a.style.display='none'; } });
    $$('[data-tamagotchi]').forEach(function(a){ if(CFG.TAMAGOTCHI_URL){ a.href=CFG.TAMAGOTCHI_URL; } else { a.style.display='none'; } });
    /* 사업자 정보 (그로우픽 공통 설정) */
    if(GP && GP.BIZ){
      var B=GP.BIZ;
      $$('[data-biz]').forEach(function(e){
        e.innerHTML = '상호 '+B.COMPANY+' | 대표 '+B.CEO+' | 사업자등록번호 '+B.BIZ_NO+' | 통신판매업신고 '+B.SALES_NO+'<br>'+
          B.ADDRESS+'<br>고객센터 '+B.PHONE+' ('+B.CS_HOURS+') | '+B.EMAIL;
      });
    }
  })();

  /* ===== 카운트다운 ===== */
  (function(){
    if(!CFG.LIVE_DATE) return;
    var target=new Date(CFG.LIVE_DATE).getTime(); if(isNaN(target)) return;
    var boxes=$$('[data-count-box]'), times=$$('[data-count-time]'), labs=$$('[data-count-lab]');
    if(!times.length) return;
    labs.forEach(function(e){ e.textContent=CFG.DEADLINE_LABEL||'라이브 시작까지'; });
    boxes.forEach(function(b){ b.style.display='block'; });
    function pad(n){ return n<10?'0'+n:''+n; }
    (function tick(){
      var d=target-Date.now(), txt;
      if(d<=0){ txt='라이브 진행 중'; }
      else { var day=Math.floor(d/864e5), h=Math.floor(d/36e5)%24, m=Math.floor(d/6e4)%60, s=Math.floor(d/1e3)%60; txt=(day>0?day+'일 ':'')+pad(h)+':'+pad(m)+':'+pad(s); }
      times.forEach(function(e){ e.textContent=txt; });
      if(d>0) setTimeout(tick,1000);
    })();
  })();

  /* ===== 등장 애니메이션 / 구간 측정 ===== */
  var rvo=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rvo.unobserve(e.target); } }); },{threshold:.08});
  $$('.rv').forEach(function(e){ rvo.observe(e); });
  var seen={};
  $$('[data-section]').forEach(function(el){
    var th = el.offsetHeight > innerHeight ? .12 : .5;
    new IntersectionObserver(function(en,ob){ en.forEach(function(e){ if(!e.isIntersecting) return; var k=el.dataset.section; if(seen[k]) return; seen[k]=true; ob.disconnect(); track('view_section',{section_name:k, section_order:Number(el.dataset.order)}); }); },{threshold:th}).observe(el);
  });
  /* 격자 셀 순차 등장 */
  $$('.grid20 .c').forEach(function(c,i){ c.style.setProperty('--i', i); });

  /* ===== 스크롤 깊이 + 하단 바 ===== */
  var marks=[25,50,75,100], fired={};
  function onScroll(){
    var h=document.documentElement.scrollHeight-innerHeight;
    if(h>0){ var pct=scrollY/h*100; marks.forEach(function(m){ if(pct>=m&&!fired[m]){ fired[m]=true; track('scroll_depth',{percent:m}); } }); }
    var dock=$('#dock'); if(!dock) return;
    if(isPC()){ dock.classList.remove('show'); return; }
    var fb=$('#formcard-bottom'), inForm=false;
    if(fb){ var b=fb.getBoundingClientRect(); inForm=(b.top<innerHeight&&b.bottom>0); }
    /* 본문 안의 신청 버튼(히어로·중간 CTA)이 화면에 보이는 동안은 하단 바를 숨긴다 (버튼 두 개 동시 노출 방지) */
    var ctaOnScreen=$$('.mobile-form .btn, .hero-cta .btn').some(function(el){ var r=el.getBoundingClientRect(); return r.height>0 && r.top<innerHeight && r.bottom>0; });
    dock.classList.toggle('show', scrollY>300 && !ctaOnScreen && !inForm);
  }
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', onScroll);

  /* ===== CTA: 폼으로 스크롤 ===== */
  $$('[data-cta]').forEach(function(b){
    if(b.getAttribute('type')==='submit') return;
    if(b.tagName==='A' && b.getAttribute('href') && b.getAttribute('href').charAt(0)!=='#'){
      b.addEventListener('click', function(){ track('cta_click',{cta_location:b.dataset.cta, cta_type:b.dataset.ctaType||'link', cta_text:b.textContent.trim()}); });
      return;
    }
    b.addEventListener('click', function(ev){
      ev.preventDefault();
      track('cta_click',{cta_location:b.dataset.cta, cta_type:'free', cta_text:b.textContent.trim()});
      var card = isPC() ? $('#formcard-top') : $('#formcard-bottom');
      var target = isPC() ? $('#sideCol') : $('#apply');
      if(!target){ return; }
      target.scrollIntoView({behavior:reduced?'auto':'smooth', block:isPC()?'center':'start'});
      setTimeout(function(){ target.scrollIntoView({behavior:'auto', block:isPC()?'center':'start'}); }, reduced?0:900);
      setTimeout(function(){ var f=card&&card.querySelector('input[name=name]'); if(f) f.focus({preventScroll:true}); }, reduced?0:1000);
    });
  });

  /* ===== 신청 폼 ===== */
  $$('.applyForm').forEach(function(form){
    var where=form.dataset.form, card=form.closest('.formcard'), doneBox=card.querySelector('.done'), started=false;
    form.addEventListener('focusin', function(){ if(started) return; started=true; track('form_start',{form_location:where}); });
    $$('input[name=p2], input[name=p3]', form).forEach(function(i){
      i.addEventListener('input', function(){ this.value=this.value.replace(/\D/g,'').slice(0,4); if(this.value.length===4 && this.name==='p2'){ var n=form.querySelector('input[name=p3]'); if(n) n.focus(); } });
    });
    var all=card.querySelector('.agree-all'), ags=$$('.ag',card);
    if(all){ all.addEventListener('change', function(){ ags.forEach(function(a){ a.checked=all.checked; }); }); }
    ags.forEach(function(a){ a.addEventListener('change', function(){ if(all) all.checked=ags.every(function(x){return x.checked}); }); });
    function bad(sel,is){ var f=form.querySelector(sel); if(f) f.classList.toggle('bad',is); }
    form.addEventListener('input', function(ev){ var f=ev.target.closest('.field'); if(f) f.classList.remove('bad'); });
    card.addEventListener('change', function(){ var ae=card.querySelector('.agree-err'); if(ae && $$('.ag.req',card).every(function(a){return a.checked;})) ae.style.display='none'; });

    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      track('form_submit',{form_location:where});
      var name=form.querySelector('input[name=name]').value.trim();
      var p1=form.querySelector('select[name=p1]').value, p2=form.querySelector('input[name=p2]').value.trim(), p3=form.querySelector('input[name=p3]').value.trim();
      var agreed=$$('.ag.req',card).every(function(a){ return a.checked; });
      var bName=name.length<2, bPhone=!(p2.length>=3&&p3.length===4);
      bad('.f-name',bName); bad('.f-phone',bPhone);
      var ae=card.querySelector('.agree-err'); if(ae) ae.style.display=agreed?'none':'block';
      if(bName||bPhone||!agreed){
        track('form_error',{error_field:bName?'name':(bPhone?'phone':'agreement'), form_location:where});
        (bName?form.querySelector('input[name=name]'):bPhone?form.querySelector('input[name=p2]'):card.querySelector('.ag')).focus();
        return;
      }
      var btn=form.querySelector('button[type=submit]');
      var payload=Object.assign({
        form_type: CFG.FORM_TYPE||'sf_free_apply', cohort:'shortsfighter_2',
        name:name, phone:p1+'-'+p2+'-'+p3,
        agree_privacy:'Y', agree_marketing:'Y',
        form_location:where, page:location.pathname, submitted_at:new Date().toISOString()
      }, attribution());

      function success(){
        track('sign_up',{method:'landing_form', form_location:where});
        if(window.fbq) window.fbq('track','Lead',{content_name:'shortsfighter_free', content_category:where});
        form.style.display='none'; if(failBox) failBox.style.display='none'; doneBox.style.display='block';
        card.scrollIntoView({behavior:'auto', block:'center'});
        try{ sessionStorage.setItem('sf_applied', JSON.stringify({name:name, at:Date.now()})); }catch(e){}
        var to = CFG.THANKS_URL || 'thanks.html';
        setTimeout(function(){ location.href = to; }, 400);
      }
      /* 실패 화면: 다시 보내기 + 전화/카톡 + 입력한 내용 (고객 제출 규칙 2026-10-01) */
      function fail(reason){
        var late = reason === 'timeout';
        track('form_error',{error_field:'network', cta_type:'send_fail', fail_reason:reason, form_location:where});
        btn.disabled=false; btn.textContent='무료 라이브 신청하기';
        if(!failBox){ failBox=document.createElement('div'); failBox.className='sendfail'; card.appendChild(failBox); }
        /* 전화번호, 문자로 유도하지 않는다 (2026-10-09 JY). 다른 길은 오픈채팅 하나 */
        failBox.innerHTML =
          '<p class="sf-t">'+(late?'접수 확인이 늦어지고 있습니다':'신청이 아직 접수되지 않았습니다')+'</p>'+
          '<p class="sf-d">'+(late?'접수됐을 수도 있지만, 확실히 하려면 오픈채팅방에도 남겨 주세요.':'회사 보안망이나 인터넷 상태 때문에 막혔을 수 있습니다.')+'</p>'+
          '<button type="button" class="btn sf-retry">다시 보내기</button>'+
          (CFG.OPENCHAT_URL?'<a class="btn ghost sf-alt" href="'+CFG.OPENCHAT_URL+'" target="_blank" rel="noopener">오픈채팅방에서 신청하기</a>':'')+
          '<p class="sf-mine">입력하신 내용: <b>'+name.replace(/</g,'&lt;')+' / '+payload.phone+'</b></p>';
        failBox.style.display='block';
        failBox.querySelector('.sf-retry').addEventListener('click', function(){ failBox.style.display='none'; send(); });
        failBox.scrollIntoView({behavior:'auto', block:'center'});
      }
      var failBox=card.querySelector('.sendfail');
      function send(){
        btn.disabled=true; btn.textContent='보내는 중...';
        if(LOCAL && !window.SF_TEST_ENDPOINT){ console.warn('[SF] 로컬 미리보기. 전송 생략', payload); success(); return; }
        confirmedSubmit({ endpoint: window.SF_TEST_ENDPOINT || CFG.FORM_ENDPOINT, payload: payload, timeout: 20000,
          onOk: success, onFail: fail });
      }
      send();
    });
  });


  /* v3 애니메이션 (2026-10-09): 숫자 올라가기, 목록 차례 등장, 연표 선 그리기.
     움직임 줄이기 설정이면 아무것도 안 한다. 스크립트가 없으면 CSS 도 초기 숨김을 걸지 않는다(.anim-on 이 있을 때만). */
  (function(){
    if(reduced || !('IntersectionObserver' in window)) return;
    var root=document.documentElement; root.classList.add('anim-on');
    var STAG='.life, .vs, .gifts, .proofgrid, .li-card dl, .points, .ladder, .nos-row, .stats, .winrow, .biglist';
    $$(STAG).forEach(function(box){ Array.prototype.forEach.call(box.children, function(c,i){ c.style.setProperty('--i', i); }); box.classList.add('stag'); });
    function fmt(n, comma){ var s=String(Math.round(n)); return comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s; }
    function countUp(el){
      var t=null; for(var k=0;k<el.childNodes.length;k++){ if(el.childNodes[k].nodeType===3 && /\d/.test(el.childNodes[k].nodeValue)){ t=el.childNodes[k]; break; } }
      if(!t) return; var m=t.nodeValue.match(/^(\D*)([\d,]+)(.*)$/); if(!m) return;
      var to=parseInt(m[2].replace(/,/g,''),10); if(!(to>1)) return;
      var comma=m[2].indexOf(',')>=0, t0=null, dur=1100;
      function step(ts){ if(!t0) t0=ts; var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3);
        t.nodeValue=m[1]+fmt(to*e, comma)+m[3]; if(p<1) requestAnimationFrame(step); }
      t.nodeValue=m[1]+'0'+m[3]; requestAnimationFrame(step);
    }
    var NUMS='.mega .num, .stat .k, .win .what em, .review .nums b, .ladder b, .hero-claim em';
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return;
      var el=e.target; io.unobserve(el);
      if(el.matches(NUMS)) countUp(el); else el.classList.add('in'); }); }, {threshold:.25, rootMargin:'0px 0px -6% 0px'});
    $$(STAG).forEach(function(b){ io.observe(b); });
    $$(NUMS).forEach(function(n){ io.observe(n); });
  })();

  /* v3: 하단 바 남은 일수 (진짜 날짜 기준) */
  (function(){
    var d=new Date(CFG.LIVE_DATE||''); if(isNaN(d)) return;
    var t=new Date(); t.setHours(0,0,0,0); var d0=new Date(d); d0.setHours(0,0,0,0);
    var n=Math.round((d0-t)/864e5), txt=n>0?'D-'+n:(n===0?'오늘':'');
    $$('[data-dday]').forEach(function(e){ if(txt){ e.textContent=txt; e.style.display=''; } else e.style.display='none'; });
  })();

  onScroll();

  /* 고객 제출 공용 부품 (외부 파일로 불러오지 않고 복사, 2026-10-01 규칙) */
  function confirmedSubmit(o){
    var finished = false, timer = null, ctrl = null;
    function end(ok, reason){
      if(finished) return; finished = true; clearTimeout(timer);
      try{ ok ? o.onOk() : o.onFail(reason); }catch(e){ if(window.console) console.error(e); }
    }
    if(!o.endpoint){ end(false, 'server:no_endpoint'); return; }
    try{ ctrl = new AbortController(); }catch(e){}
    timer = setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(e){} end(false, 'timeout'); }, o.timeout || 20000);
    try{
      fetch(o.endpoint, {
        method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' },
        body: JSON.stringify(o.payload), signal: ctrl ? ctrl.signal : undefined
      }).then(function(r){ return r.text(); })
        .then(function(t){
          var j = null; try{ j = JSON.parse(t); }catch(e){}
          if(j && j.ok === true) end(true, '');
          else end(false, 'server:' + ((j && j.error) || 'bad_response'));
        })
        .catch(function(){ end(false, 'network'); });
    }catch(e){ end(false, 'network'); }
  }
})();
