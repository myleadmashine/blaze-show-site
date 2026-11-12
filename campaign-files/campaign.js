(() => {
  'use strict';
  const cfg = window.BLAZE_CONFIG || {};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const digits = value => String(value || '').replace(/\D/g, '');
  const qs = new URLSearchParams(location.search);
  const utm = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k => [k, qs.get(k) || '']).filter(([,v]) => v));
  let analyticsReady = false;
  function track(name, params={}) {
    if (!analyticsReady) return;
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      if (typeof window.ym === 'function' && cfg.analytics?.yandexMetricaId) window.ym(Number(cfg.analytics.yandexMetricaId), 'reachGoal', name, params);
    } catch (_) {}
  }
  function loadAnalytics() {
    if (analyticsReady) return;
    analyticsReady = true;
    const ga = String(cfg.analytics?.ga4MeasurementId || '').trim();
    const ads = String(cfg.analytics?.googleAdsId || '').trim();
    const ymId = String(cfg.analytics?.yandexMetricaId || '').trim();
    const clarityId = String(cfg.analytics?.clarityProjectId || '').trim();
    const first = /^G-[A-Z0-9]+$/i.test(ga) ? ga : (/^AW-\d+$/.test(ads) ? ads : '');
    if (first) {
      const script = document.createElement('script'); script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(first); document.head.appendChild(script);
      window.dataLayer = window.dataLayer || []; window.gtag = function(){window.dataLayer.push(arguments)};
      window.gtag('js', new Date()); if (/^G-[A-Z0-9]+$/i.test(ga)) window.gtag('config', ga);
      if (/^AW-\d+$/.test(ads)) window.gtag('config', ads);
    }
    if (/^\d{4,20}$/.test(ymId)) {
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
      window.ym(Number(ymId), 'init', {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
    }
    if (/^[a-z0-9]+$/i.test(clarityId)) {
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',clarityId);
    }
    track('campaign_page_view', {page:location.pathname, source:utm.utm_source || 'direct'});
  }
  const consentBox = $('#analytics-consent');
  let consent = '';
  try { consent = localStorage.getItem('blaze-analytics-consent') || ''; } catch (_) {}
  if (consent === 'yes') loadAnalytics(); else if (consent !== 'no' && consentBox) consentBox.hidden = false;
  $('#analytics-accept')?.addEventListener('click', () => { try {localStorage.setItem('blaze-analytics-consent','yes')} catch (_) {} if(consentBox) consentBox.hidden=true; loadAnalytics(); });
  $('#analytics-reject')?.addEventListener('click', () => { try {localStorage.setItem('blaze-analytics-consent','no')} catch (_) {} if(consentBox) consentBox.hidden=true; });

  const modal = $('#quiz-modal');
  const openModal = (source, packageName='') => { if (!modal) return; const form = $('#coupon-form'); if (form) form.reset(); $('#quiz-questions').hidden = false; $('#quiz-contacts').hidden = true; $('#quiz-status').textContent = ''; showStep(1); const packageField = $('select[name=package], input[name=package]', form || document); if (packageField && packageName) packageField.value = packageName; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); track('coupon_quiz_open',{source}); };
  const closeModal = () => { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); };
  $('[data-open-quiz]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.source || 'cta', button.dataset.package || '')));
  const marquizUrl = String(window.BLAZE_MARQUIZ_URL || '').trim();
  $('[data-marquiz]').forEach(link => { if (marquizUrl) { link.href = marquizUrl; link.target = '_blank'; link.rel = 'noopener'; link.hidden = false; } else link.hidden = true; });
  $$('[data-close-quiz]').forEach(button => button.addEventListener('click', closeModal));
  if (modal) modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  let step = 1;
  const stepEls = $$('.quiz-step');
  const progress = $('#quiz-progress');
  const stepNumber = $('#quiz-step-number');
  const nextBtn = $('#quiz-next');
  const prevBtn = $('#quiz-prev');
  function showStep(next) {
    step = Math.max(1, Math.min(4, next));
    stepEls.forEach(el => el.classList.toggle('active', Number(el.dataset.step) === step));
    if (progress) progress.style.width = (step * 25) + '%';
    if (stepNumber) stepNumber.textContent = step + ' / 4';
    if (prevBtn) prevBtn.hidden = step === 1;
    if (nextBtn) nextBtn.textContent = step === 4 ? 'Перейти к получению купона' : 'Далее';
    track('coupon_quiz_step',{step});
  }
  function stepIsValid() {
    const active = $('.quiz-step.active');
    if (!active) return false;
    const required = $$('[required]', active);
    for (const field of required) {
      if (field.type === 'radio') {
        const group = $$('input[type="radio"][name="'+field.name+'"]', active);
        if (!group.some(x => x.checked)) { group[0]?.focus(); return false; }
      } else if (!field.value.trim()) { field.focus(); return false; }
    }
    return true;
  }
  nextBtn?.addEventListener('click', () => {
    if (!stepIsValid()) { $('#quiz-status').textContent = 'Ответьте на вопрос, чтобы продолжить.'; return; }
    $('#quiz-status').textContent = '';
    if (step < 4) showStep(step + 1);
    else { $('#quiz-questions').hidden = true; $('#quiz-contacts').hidden = false; if(stepNumber)stepNumber.textContent='Контакт'; if(progress)progress.style.width='100%'; track('coupon_quiz_completed'); }
  });
  prevBtn?.addEventListener('click', () => { $('#quiz-status').textContent=''; if($('#quiz-contacts') && !$('#quiz-contacts').hidden){$('#quiz-contacts').hidden=true;$('#quiz-questions').hidden=false;showStep(4);} else showStep(step-1); });
  showStep(1);

  const guestSlider = $('#guest-slider');
  const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₸';
  if (guestSlider) {
    const update = () => {
      const guests = Number(guestSlider.value), price = Number(guestSlider.dataset.price || 300000), discounted = Math.max(0, price - 25000);
      if ($('#guest-value')) $('#guest-value').textContent = guests;
      if ($('#guest-per-person')) $('#guest-per-person').textContent = fmt(price / guests);
      if ($('#guest-per-person-sale')) $('#guest-per-person-sale').textContent = fmt(discounted / guests);
    };
    guestSlider.addEventListener('input', update); update();
  }

  const managerButton = $('#manager-toggle'), managerPanel = $('#manager-panel');
  if (managerButton && managerPanel) managerButton.addEventListener('click', () => { managerPanel.classList.toggle('open'); track('manager_helper_toggle',{open:managerPanel.classList.contains('open')}); });
  $$('[data-manager-open]').forEach(button => button.addEventListener('click', () => { managerPanel?.classList.remove('open'); openModal('manager_widget'); }));
  $$('[data-track]').forEach(el => el.addEventListener('click', () => track(el.dataset.track)));
  $$('a[href^="https://wa.me/"]').forEach(a => a.addEventListener('click', () => track('whatsapp_click')));

  const form = $('#coupon-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const fd = new FormData(form);
    const phone = String(fd.get('phone') || '').trim();
    if (digits(phone).length < 10 || digits(phone).length > 15) { $('#quiz-status').textContent = 'Проверьте номер телефона и код страны.'; return; }
    if (fd.get('consent') !== 'on') { $('#quiz-status').textContent = 'Нужно согласие на обработку заявки.'; return; }
    const eventType = String(fd.get('eventType') || ''), date = String(fd.get('eventDate') || ''), place = String(fd.get('venue') || ''), guests = String(fd.get('guestCount') || '');
    const name = String(fd.get('name') || '').trim();
    const product = document.body.dataset.product || 'Шоу-программа BLAZE SHOW';
    const packageName = String(fd.get('package') || '');
    const lead = {requestId:(crypto.randomUUID ? crypto.randomUUID() : 'blaze-'+Date.now()),name,phone,eventType,eventDate:date,venue:place,guestCount:guests,product,package:packageName,coupon:'25 000 KZT',pageUrl:location.href,utm,consent:true};
    const endpoint = String(cfg.leadDelivery?.endpoint || '').trim(), wa = digits(cfg.contacts?.whatsappNumber || '');
    const submit = $('#quiz-submit'); if (submit) {submit.disabled=true;submit.textContent='Отправляем…';}
    $('#quiz-status').textContent=''; track('lead_submit',{product});
    try {
      if (endpoint) {
        const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead})});
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error(result.message || 'Не удалось передать заявку.');
        track('generate_lead',{product,method:'endpoint'});
        if (cfg.analytics?.googleAdsId && cfg.analytics?.googleAdsConversionLabel && typeof window.gtag === 'function') window.gtag('event','conversion',{send_to:cfg.analytics.googleAdsId+'/'+cfg.analytics.googleAdsConversionLabel});
        $('#quiz-status').textContent='Заявка отправлена. Менеджер проверит дату и свяжется с вами.';
        form.reset(); closeModal();
      } else if (wa) {
        const msg = ['Заявка BLAZE SHOW — купон 25 000 ₸', 'Имя: '+(name || 'не указано'), 'Телефон: '+phone, 'Мероприятие: '+eventType, 'Дата: '+date, 'Площадка/адрес: '+place, 'Гостей: '+guests, 'Продукт: '+product, 'Пакет: '+(packageName || 'не выбран'), 'Страница: '+location.href].join('\n');
        window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(msg),'_blank','noopener');
        $('#quiz-status').textContent='Открылся WhatsApp с готовой заявкой. Нажмите «Отправить», чтобы передать её менеджеру.';
        track('lead_whatsapp_handoff',{product});
      } else {
        throw new Error('Форма пока не подключена: добавьте рабочий WhatsApp или адрес приёма заявок в assets/js/config.js.');
      }
    } catch (err) { $('#quiz-status').textContent = err.message || 'Ошибка отправки. Попробуйте ещё раз.'; track('lead_error',{product}); }
    finally { if (submit) {submit.disabled=false;submit.textContent='Получить купон −25 000 ₸';} }
  });
})();