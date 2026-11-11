(() => {
  'use strict';
  const cfg = window.BLAZE_CONFIG || {};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const digits = s => String(s || '').replace(/\D/g, '');
  const money = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₸';
  const qs = new URLSearchParams(location.search);
  const utm = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,qs.get(k)||'']).filter(([,v])=>v));
  let analyticsEnabled = false;

  function track(name, params={}) {
    if (!analyticsEnabled) return;
    try {
      if (typeof window.gtag === 'function') window.gtag('event',name,params);
      if (typeof window.ym === 'function' && cfg.analytics?.yandexMetricaId) window.ym(Number(cfg.analytics.yandexMetricaId),'reachGoal',name,params);
      if (typeof window.clarity === 'function') window.clarity('event',name);
    } catch (_) {}
  }
  function loadAnalytics() {
    if (analyticsEnabled) return;
    analyticsEnabled = true;
    const ga=String(cfg.analytics?.ga4MeasurementId||'').trim();
    const ads=String(cfg.analytics?.googleAdsId||'').trim();
    const ymId=String(cfg.analytics?.yandexMetricaId||'').trim();
    const clarityId=String(cfg.analytics?.clarityProjectId||'').trim();
    const firstId=/^G-[A-Z0-9]+$/i.test(ga)?ga:(/^AW-\d+$/.test(ads)?ads:'');
    if(firstId){
      const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(firstId);document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());
      if(/^G-[A-Z0-9]+$/i.test(ga))window.gtag('config',ga,{send_page_view:true});
      if(/^AW-\d+$/.test(ads))window.gtag('config',ads);
    }
    if(/^\d{4,20}$/.test(ymId)){
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
      window.ym(Number(ymId),'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
    }
    if(/^[a-z0-9]+$/i.test(clarityId)){
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',clarityId);
    }
    track('campaign_page_view',{page:location.pathname,utm_source:utm.utm_source||'(direct)'});
  }

  // Analytics load only after the visitor opts in.
  const consentBanner=$('#analytics-consent');
  let storedConsent='';
  try{storedConsent=localStorage.getItem('blaze_campaign_analytics_consent')||'';}catch(_){}
  if(storedConsent==='yes') loadAnalytics();
  else if(storedConsent!=='no'&&consentBanner) consentBanner.hidden=false;
  $('#analytics-accept')?.addEventListener('click',()=>{try{localStorage.setItem('blaze_campaign_analytics_consent','yes');}catch(_){};if(consentBanner)consentBanner.hidden=true;loadAnalytics();});
  $('#analytics-reject')?.addEventListener('click',()=>{try{localStorage.setItem('blaze_campaign_analytics_consent','no');}catch(_){};if(consentBanner)consentBanner.hidden=true;});

  const couponModal=$('#coupon-modal');
  function openCoupon(source='cta'){if(!couponModal)return;couponModal.classList.add('open');couponModal.setAttribute('aria-hidden','false');track('coupon_open',{source});const p=$('#lead-phone');if(p)setTimeout(()=>p.focus(),100);}
  function closeCoupon(){if(!couponModal)return;couponModal.classList.remove('open');couponModal.setAttribute('aria-hidden','true');}
  $$('[data-coupon]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.prefillPackage&&$('#lead-package'))$('#lead-package').value=b.dataset.prefillPackage;if(b.dataset.prefillProduct&&$('#lead-product'))$('#lead-product').value=b.dataset.prefillProduct;openCoupon(b.dataset.coupon||'button');}));
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeCoupon));
  if(couponModal)couponModal.addEventListener('click',e=>{if(e.target===couponModal)closeCoupon();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCoupon();});

  const slider=$('#guest-slider');
  if(slider){const update=()=>{const n=Number(slider.value),total=Number(slider.dataset.price||300000);if($('#guest-number'))$('#guest-number').textContent=n;if($('#per-guest'))$('#per-guest').textContent=money(total/n);if($('#per-guest-card'))$('#per-guest-card').textContent=money(total/n);if($('#per-guest-coupon'))$('#per-guest-coupon').textContent=money(Math.max(0,total-25000)/n);};slider.addEventListener('input',update);update();}

  const managerToggle=$('#manager-toggle'),managerPanel=$('#manager-panel');
  if(managerToggle&&managerPanel){
    managerToggle.addEventListener('click',()=>{managerPanel.classList.toggle('open');track('manager_widget_toggle',{open:managerPanel.classList.contains('open')});});
    $$('[data-manager-action]',managerPanel).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.managerAction;track('manager_quick_action',{action:a});const dest=a==='coupon'?'#coupon':a==='video'?(($('#videos')?'#videos':($('#video')?'#video':'#bollywood'))):(($('#packages')?'#packages':'#price'));managerPanel.classList.remove('open');$(dest)?.scrollIntoView({behavior:'smooth'});}));
  }
  $$('a[href^="https://wa.me/"],a[href^="https://api.whatsapp.com/"]').forEach(a=>a.addEventListener('click',()=>track('whatsapp_click',{page:location.pathname})));
  $$('[data-track]').forEach(el=>el.addEventListener('click',()=>track(el.dataset.track,{page:location.pathname})));
  $$('video').forEach(v=>{v.addEventListener('play',()=>track('video_start',{video_title:v.dataset.title||'campaign_video'}));v.addEventListener('ended',()=>track('video_complete',{video_title:v.dataset.title||'campaign_video'}));});

  const marquizUrl=String(window.BLAZE_MARQUIZ_URL||cfg.quiz?.marquizUrl||'').trim();
  $$('[data-marquiz]').forEach(a=>{if(marquizUrl){a.href=marquizUrl;a.target='_blank';a.rel='noopener';}else{a.addEventListener('click',e=>{e.preventDefault();openCoupon('quiz_not_connected');});}});

  const form=$('#campaign-lead-form');
  if(form)form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form),phone=String(fd.get('phone')||'').trim();
    if(digits(phone).length<10||digits(phone).length>15){$('#lead-status').textContent='Проверьте телефон: укажите номер с кодом страны.';return;}
    if(fd.get('consent')!=='on'){ $('#lead-status').textContent='Нужно согласие на обработку заявки.'; return; }
    const date=String(fd.get('eventDate')||''),eventType=String(fd.get('eventType')||'Свадьба'),count=Number(fd.get('guestCount')||150);
    const guestCount=count<=100?'50–100':count<=200?'100–200':count<=300?'200–300':'300+';
    const packageName=String(fd.get('package')||'BLAZE MOMENT'),product=String(fd.get('product')||'Шоу-программа BLAZE SHOW'),name=String(fd.get('name')||'').trim();
    const coupon=fd.get('coupon')==='on',eventTime=String(fd.get('eventTime')||''),venue=String(fd.get('venue')||'').trim();
    const lead={requestId:(crypto.randomUUID?crypto.randomUUID():`blaze-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),name,phone,eventType,eventDate:date,dateNotSet:!date,guestCount,package:packageName,customProgram:packageName==='Индивидуальная программа'?'Да':'Нет',note:`Продукт: ${product}. Время: ${eventTime||'не указано'}. Площадка: ${venue||'не указано'}. Купон: ${coupon?'да':'нет'}. Страница: ${location.pathname}. UTM: ${JSON.stringify(utm).slice(0,100)}.`,consent:true,pageUrl:location.href,website:String(fd.get('website')||'')};
    const endpoint=String(cfg.leadDelivery?.endpoint||'').trim(),wa=digits(cfg.contacts?.whatsappNumber||'');
    const btn=$('#lead-submit');$('#lead-status').textContent='';btn.disabled=true;btn.textContent='Отправляем…';track('lead_form_submit',{campaign:product,coupon});
    try{
      if(endpoint){
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead})});
        const result=await response.json();if(!response.ok||result.ok!==true)throw new Error(result.message||'Не удалось доставить заявку.');
        track('generate_lead',{campaign:product,delivery:'backend'});
        if(cfg.analytics?.googleAdsId&&cfg.analytics?.googleAdsConversionLabel&&typeof window.gtag==='function')window.gtag('event','conversion',{send_to:cfg.analytics.googleAdsId+'/'+cfg.analytics.googleAdsConversionLabel});
        $('#lead-status').textContent='Заявка отправлена. Менеджер свяжется с вами для подтверждения даты и программы.';form.reset();closeCoupon();
      }else if(wa){
        const message=[`Заявка BLAZE SHOW`,`Имя: ${name||'не указано'}`,`Телефон: ${phone}`,`Мероприятие: ${eventType}`,`Дата: ${date||'не определена'}`,`Время: ${eventTime||'не указано'}`,`Площадка: ${venue||'не указано'}`,`Гостей: ${count}`,`Продукт: ${product}`,`Купон 25 000 ₸: ${coupon?'да':'нет'}`,`Пакет: ${packageName}`,`Страница: ${location.href}`].join('\n');
        window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(message),'_blank','noopener');
        $('#lead-status').textContent='Открылся WhatsApp с заполненным сообщением. Нажмите «Отправить» в WhatsApp, чтобы передать заявку.';track('lead_whatsapp_handoff',{campaign:product});
      }else throw new Error('Заявка пока не подключена: добавьте корпоративный WhatsApp или endpoint приёма заявок в настройки проекта.');
    }catch(err){$('#lead-status').textContent=err.message||'Ошибка отправки. Попробуйте позже.';track('lead_delivery_error',{campaign:product});}
    finally{btn.disabled=false;btn.textContent='Забрать купон и отправить заявку';}
  });

  const tel=digits(cfg.contacts?.phoneLink||cfg.contacts?.whatsappNumber||'');
  $$('[data-config-phone]').forEach(a=>{if(tel){a.href='tel:+'+tel;a.classList.remove('hidden');}else a.classList.add('hidden');});
  $$('[data-config-whatsapp]').forEach(a=>{const n=digits(cfg.contacts?.whatsappNumber||'');if(n){a.href='https://wa.me/'+n;a.classList.remove('hidden');}else a.classList.add('hidden');});
})();
