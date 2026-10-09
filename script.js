/* =========================================================
   Daniel's Pizzeria — interactions
   ========================================================= */
const IMG = 'assets/img/menu/';
const CONTACT_EMAIL = 'contact@daniels-pizzeria.com';
const OPEN_MIN = 11 * 60;
const CLOSE_MIN = 23 * 60;
const MAX_GUESTS = 12;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIES = [
  { key: 'pizza', label: 'Pizzas', intro: 'Cuites au feu de bois, sur notre pâte pétrie du jour.' },
  { key: 'salade', label: 'Salades', intro: 'Fraîches et généreuses, préparées à la minute.' },
  { key: 'dessert', label: 'Desserts', intro: 'La touche sucrée pour finir en beauté.' },
  { key: 'boisson', label: 'Boissons', intro: 'Pour accompagner votre pizza.' },
];

const MENU = [
  { cat: 'pizza', name: 'Spéciale', desc: 'Tomate, poulet, raisins, mozzarella, sauce maison', price: 16.99, img: 1, badge: 'signature' },
  { cat: 'pizza', name: 'Margherita', desc: 'Tomate, mozzarella, basilic', price: 12.99, img: 3, badge: 'veggie' },
  { cat: 'pizza', name: 'Légumes', desc: 'Fromage, tomate, oignon, olives, poivrons', price: 12.99, img: 2, badge: 'veggie' },
  { cat: 'pizza', name: 'Poulet barbecue', desc: 'Base barbecue, mozzarella, poulet', price: 14.99, img: 4 },
  { cat: 'pizza', name: 'Hawaïenne', desc: 'Tomate, mozzarella, jambon, ananas', price: 14.99, img: 5 },
  { cat: 'pizza', name: '4 Fromages', desc: 'Mozzarella, chèvre, gorgonzola, parmesan', price: 14.99, img: 6, badge: 'veggie' },
  { cat: 'pizza', name: 'Pepperoni', desc: 'Sauce tomate, mozzarella, pepperoni', price: 12.99, img: 8 },
  { cat: 'pizza', name: 'Pepperoni & légumes', desc: 'Sauce tomate, mozzarella, pepperoni, légumes', price: 12.99, img: 7 },
  { cat: 'salade', name: 'Salade saumon', desc: 'Saumon, avocat, brocoli, tomate', price: 14.99, img: 9 },
  { cat: 'salade', name: 'Salade grecque', desc: 'Tomates, concombre, olives, feta', price: 12.99, img: 10, badge: 'veggie' },
  { cat: 'salade', name: 'Salade César', desc: 'Poulet, croûtons, parmesan, sauce César', price: 13.99, img: 11 },
  { cat: 'salade', name: 'Salade méditerranéenne', desc: 'Olives, poivrons, feta, tomate', price: 13.49, img: 12, badge: 'veggie' },
  { cat: 'dessert', name: 'Milkshake', desc: 'Lait, chocolat, glace', price: 5.99, img: 13 },
  { cat: 'dessert', name: 'Glace', desc: 'Parfum au choix', price: 2.5, img: 14 },
  { cat: 'dessert', name: 'Macarons', desc: 'Assortiment de 4 pièces', price: 3.99, img: 15 },
  { cat: 'dessert', name: 'Brownie', desc: 'Brownie au chocolat, fait maison', price: 4.5, img: 16 },
  { cat: 'boisson', name: 'Bière', desc: '33 cl, bien fraîche', price: 3.5, img: 17 },
  { cat: 'boisson', name: "Jack Daniel's", desc: 'Un verre de whiskey', price: 5.5, img: 18 },
  { cat: 'boisson', name: 'Coca-Cola', desc: '33 cl, bien frais', price: 2, img: 19 },
  { cat: 'boisson', name: 'Pepsi', desc: '33 cl, bien frais', price: 2, img: 20 },
];

const BADGES = { signature: ['Signature', 'badge-signature'], veggie: ['Végétarien', 'badge-veggie'] };
const euro = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' });
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Heure de Bruxelles (pour le statut et les créneaux) ---------- */
function brusselsNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Brussels', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    dayIndex: days.indexOf(parts.weekday), // 0 = lundi
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

/* ---------- Statut ouvert / fermé + horaires ---------- */
function updateOpenStatus() {
  const { minutes } = brusselsNow();
  const open = minutes >= OPEN_MIN && minutes < CLOSE_MIN;
  let text;
  if (open) text = CLOSE_MIN - minutes <= 60 ? 'Ferme bientôt · à 23h' : "Ouvert maintenant · jusqu'à 23h";
  else text = minutes < OPEN_MIN ? 'Fermé · ouvre à 11h' : 'Fermé · ouvre demain à 11h';

  $$('[data-open-status]').forEach((el) => {
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
    $('.status-text', el).textContent = text;
  });
}

function renderHours() {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const { dayIndex } = brusselsNow();
  $('#hours').innerHTML = days
    .map((day, i) => `<li class="${i === dayIndex ? 'today' : ''}"><span>${day}</span><span>11:00 – 23:00</span></li>`)
    .join('');
}

/* ---------- La carte ---------- */
const tabsEl = $('#menu-tabs');
const indicator = $('.tabs-indicator', tabsEl);
const listEl = $('#menu-list');
const previewImg = $('#preview-img');
let activeCat = CATEGORIES[0].key;

function renderTabs() {
  CATEGORIES.forEach((cat) => {
    const count = MENU.filter((item) => item.cat === cat.key).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab';
    btn.id = `tab-${cat.key}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', 'menu-panel');
    btn.dataset.cat = cat.key;
    btn.innerHTML = `${cat.label}<small>${count}</small>`;
    btn.addEventListener('click', () => selectCategory(cat.key));
    tabsEl.appendChild(btn);
  });

  tabsEl.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const keys = CATEGORIES.map((c) => c.key);
    let i = keys.indexOf(activeCat);
    if (event.key === 'ArrowRight') i = (i + 1) % keys.length;
    if (event.key === 'ArrowLeft') i = (i - 1 + keys.length) % keys.length;
    if (event.key === 'Home') i = 0;
    if (event.key === 'End') i = keys.length - 1;
    selectCategory(keys[i]);
    $(`#tab-${keys[i]}`).focus();
  });
}

function moveIndicator() {
  const btn = $(`#tab-${activeCat}`);
  if (!btn) return;
  indicator.style.width = `${btn.offsetWidth}px`;
  indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
}

function setPreview(item, row) {
  $$('.dish.is-active', listEl).forEach((el) => el.classList.remove('is-active'));
  row?.classList.add('is-active');
  const src = `${IMG}${item.img}.webp`;
  if (!previewImg.src.endsWith(src)) {
    previewImg.src = src;
    previewImg.classList.remove('swap');
    void previewImg.offsetWidth; // relance l'animation
    previewImg.classList.add('swap');
  }
  $('#preview-name').textContent = item.name;
  $('#preview-price').textContent = euro.format(item.price);
}

function selectCategory(key) {
  activeCat = key;
  const cat = CATEGORIES.find((c) => c.key === key);
  const items = MENU.filter((item) => item.cat === key);

  $$('.tab', tabsEl).forEach((btn) => {
    const selected = btn.dataset.cat === key;
    btn.setAttribute('aria-selected', String(selected));
    btn.tabIndex = selected ? 0 : -1;
  });
  $('#menu-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#menu-intro').textContent = cat.intro;
  moveIndicator();

  listEl.innerHTML = items.map((item, i) => {
    const badge = item.badge ? `<span class="dish-badge ${BADGES[item.badge][1]}">${BADGES[item.badge][0]}</span>` : '';
    return `
      <li class="dish" tabindex="0" style="--d:${i}" data-index="${i}">
        <img class="dish-thumb" src="${IMG}${item.img}.webp" alt="" loading="lazy" width="64" height="64" />
        <div>
          <div class="dish-head">
            <h3 class="dish-name">${item.name}${badge}</h3>
            <span class="dish-leader" aria-hidden="true"></span>
            <span class="dish-price">${euro.format(item.price)}</span>
          </div>
          <p class="dish-desc">${item.desc}</p>
        </div>
      </li>`;
  }).join('');

  $$('.dish', listEl).forEach((row) => {
    const item = items[Number(row.dataset.index)];
    row.addEventListener('mouseenter', () => setPreview(item, row));
    row.addEventListener('focus', () => setPreview(item, row));
  });
  setPreview(items[0], $('.dish', listEl));
}

/* ---------- Apparitions au scroll + compteurs ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reducedMotion) { el.textContent = target; return; }
  const start = performance.now();
  const duration = 1400;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      $$('[data-count]', entry.target).forEach(countUp);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => observer.observe(el));
}

/* ---------- Navigation ---------- */
function initNav() {
  const topbar = $('#topbar');
  const nav = $('#nav');
  const toggle = $('#menu-toggle');
  let ticking = false;

  const onScroll = () => {
    topbar.classList.toggle('scrolled', window.scrollY > 30);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Lien actif selon la section visible
  const links = $$('a', nav);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'histoire', 'savoir-faire', 'carte', 'reservation', 'infos'].forEach((id) => spy.observe(document.getElementById(id)));
}

/* ---------- Réservation ---------- */
function initBooking() {
  const form = $('#booking-form');
  const dateInput = $('#booking-date');
  const guestsOut = $('#guests-value');
  const summary = $('#booking-summary');
  const feedback = $('#booking-feedback');
  let guests = 2;

  // Créneaux horaires
  $$('[data-slots]', form).forEach((list) => {
    list.innerHTML = list.dataset.slots.split(',').map((time) => `
      <label class="slot"><input type="radio" name="time" value="${time}" /><span>${time.replace(':', 'h')}</span></label>`).join('');
  });

  dateInput.min = brusselsNow().isoDate;

  const stepButtons = $$('[data-step]', form);
  const refreshGuests = () => {
    guestsOut.textContent = guests;
    stepButtons[0].disabled = guests <= 1;
    stepButtons[1].disabled = guests >= MAX_GUESTS;
  };
  stepButtons.forEach((btn) => btn.addEventListener('click', () => {
    guests = Math.min(MAX_GUESTS, Math.max(1, guests + Number(btn.dataset.step)));
    refreshGuests();
    refreshSummary();
  }));

  // Aujourd'hui : on désactive les créneaux déjà passés (marge de 30 min)
  const refreshSlots = () => {
    const now = brusselsNow();
    const isToday = dateInput.value === now.isoDate;
    $$('input[name="time"]', form).forEach((input) => {
      const [h, m] = input.value.split(':').map(Number);
      input.disabled = isToday && h * 60 + m < now.minutes + 30;
      if (input.disabled) input.checked = false;
    });
  };

  const formatDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
  const people = () => `${guests} ${guests > 1 ? 'personnes' : 'personne'}`;
  const selectedTime = () => $('input[name="time"]:checked', form)?.value;

  function refreshSummary() {
    const parts = [`Table pour ${people()}`];
    parts.push(dateInput.value ? formatDate(dateInput.value) : 'choisissez une date');
    if (dateInput.value) parts.push(selectedTime() ? `à ${selectedTime().replace(':', 'h')}` : 'choisissez une heure');
    summary.textContent = parts.join(' · ');
  }

  dateInput.addEventListener('change', () => { refreshSlots(); refreshSummary(); });
  form.addEventListener('change', (e) => { if (e.target.name === 'time') refreshSummary(); });
  form.addEventListener('input', (e) => {
    e.target.closest('.field')?.classList.remove('has-error');
    if (e.target.name === 'time') $('.slots', form).classList.remove('has-error');
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    refreshSlots();
    const data = new FormData(form);
    const nameInput = form.elements.namedItem('name');
    const emailInput = form.elements.namedItem('email');
    const checks = [
      [dateInput.value, dateInput, 'Choisissez une date.'],
      [selectedTime(), $('.slots', form), 'Choisissez une heure.'],
      [nameInput.value.trim(), nameInput, 'Indiquez votre nom.'],
      [emailInput.value && emailInput.checkValidity(), emailInput, 'Indiquez une adresse e-mail valide.'],
    ];
    const missing = checks.filter(([ok]) => !ok);
    $$('.has-error', form).forEach((el) => el.classList.remove('has-error'));
    if (missing.length) {
      missing.forEach(([, el]) => (el.closest('.field') || el).classList.add('has-error'));
      feedback.textContent = missing[0][2];
      feedback.className = 'form-feedback error';
      return;
    }

    const when = `${formatDate(dateInput.value)} à ${selectedTime().replace(':', 'h')}`;
    const subject = `Réservation · ${people()} · ${when}`;
    const body = [
      'Bonjour,',
      '',
      `Je souhaite réserver une table pour ${people()} le ${when}.`,
      '',
      `Nom : ${data.get('name').trim()}`,
      `E-mail : ${data.get('email')}`,
      `Message : ${data.get('message').trim() || '—'}`,
      '',
      'Merci de me confirmer la réservation.',
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = "Votre application e-mail s'ouvre avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
    feedback.className = 'form-feedback success';
  });

  refreshGuests();
  refreshSummary();
}

/* ---------- Film ---------- */
function initFilm() {
  const dialog = $('#film-dialog');
  const video = $('#film-video');
  $('#open-film').addEventListener('click', () => {
    dialog.showModal();
    video.play().catch(() => {});
  });
  $('#close-film').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => video.pause());
}

/* ---------- Toujours repartir du haut au rechargement ---------- */
// Sans ça, le navigateur restaure l'ancienne position ou saute à l'ancre de l'URL (#carte…)
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'instant' }); }
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
scrollToTop();
window.addEventListener('load', scrollToTop);
window.addEventListener('pageshow', (event) => { if (event.persisted) scrollToTop(); });

/* ---------- Démarrage ---------- */
$('#year').textContent = new Date().getFullYear();
$$('[data-menu-count]').forEach((el) => { el.dataset.count = MENU.length; el.textContent = MENU.length; });
renderTabs();
selectCategory(activeCat);
renderHours();
updateOpenStatus();
setInterval(updateOpenStatus, 60 * 1000);
initReveal();
initNav();
initBooking();
initFilm();
window.addEventListener('resize', moveIndicator);
document.fonts?.ready.then(moveIndicator);
