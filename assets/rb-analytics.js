/* Rumi Byte analytics: Google Analytics 4 with Consent Mode v2 and a cookie notice.
   To switch on, put the Measurement ID (G-XXXXXXXXXX) below. Empty = nothing loads. */
(function () {
  var GA_ID = '';
  if (!GA_ID) return;

  var KEY = 'rb-consent';
  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  var choice = getChoice();
  gtag('consent', 'default', {
    analytics_storage: choice === 'yes' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  // events: what visitors click
  function track(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button,[data-ab],[data-svc],.row');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (href.indexOf('wa.me') > -1) track('whatsapp_click', { link_text: label, page_path: location.pathname });
    else if (href.indexOf('mailto:') === 0) track('email_click', { link_text: label, page_path: location.pathname });
    else if (/instagram|tiktok|facebook/.test(href)) track('social_click', { link_url: href });
    else if (a.classList.contains('row') || a.hasAttribute('data-svc')) track('service_view', { service_name: label.replace(/View details.*$/, '').trim() });
    else if (a.hasAttribute('data-ab')) track('about_card_view', { card_name: label.replace(/Read more.*$/, '').trim() });
    else if (/^\/services\//.test(href)) track('service_page_click', { link_url: href });
  }, true);
  var form = document.getElementById('cxForm');
  if (form) form.addEventListener('submit', function () {
    var svc = document.getElementById('cSvc');
    track('generate_lead', { service: svc ? svc.value : '' });
  });

  // cookie notice
  if (choice) return;
  var css = '.rbc{position:fixed;left:16px;bottom:16px;z-index:9999;max-width:380px;padding:20px 22px;border-radius:18px;background:rgba(14,14,16,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12);box-shadow:0 20px 60px rgba(0,0,0,.45);color:#F4F4F2;font:14px/1.55 Outfit,system-ui,sans-serif;transform:translateY(20px);opacity:0;transition:transform .5s,opacity .5s}' +
    '.rbc.on{transform:none;opacity:1}.rbc p{margin:0;color:#c9c9ce}.rbc b{display:block;font-weight:500;color:#F4F4F2;margin-bottom:4px;font-size:15px}' +
    '.rbc div{display:flex;gap:8px;margin-top:14px}.rbc button{flex:1;cursor:pointer;border-radius:999px;padding:10px 16px;font:500 13.5px Outfit,system-ui,sans-serif;border:1px solid rgba(255,255,255,.22);background:transparent;color:#F4F4F2;transition:border-color .3s,transform .3s}' +
    '.rbc button:hover{border-color:#fff}.rbc button.y{background:#F4F4F2;color:#0b0b0d;border-color:#F4F4F2}.rbc button.y:hover{transform:translateY(-1px)}' +
    '@media (max-width:520px){.rbc{left:12px;right:12px;bottom:12px;max-width:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div');
  box.className = 'rbc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie preferences');
  box.innerHTML = '<b>Cookies, briefly</b><p>We use analytics cookies to understand how visitors use our website so we can improve it. No ads, no selling data.</p><div><button type="button" class="n">Decline</button><button type="button" class="y">Accept</button></div>';
  function close(v) {
    setChoice(v);
    if (v === 'yes') gtag('consent', 'update', { analytics_storage: 'granted' });
    box.classList.remove('on'); setTimeout(function () { box.remove(); }, 500);
  }
  box.querySelector('.y').addEventListener('click', function () { close('yes'); });
  box.querySelector('.n').addEventListener('click', function () { close('no'); });
  function show() { document.body.appendChild(box); requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('on'); }); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(show, 1800); });
  else setTimeout(show, 1800);
})();
