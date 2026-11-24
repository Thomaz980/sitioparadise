(() => {
  const NUM = '5581973041976';
  const wa = (msg) => `https://wa.me/${NUM}?text=${encodeURIComponent(msg)}`;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $('#ano').textContent = new Date().getFullYear();

  // links de WhatsApp com mensagem pré-preenchida
  $$('[data-wa]').forEach((a) => (a.href = wa(a.dataset.wa)));

  // cabeçalho
  const top = $('.top');
  const onScroll = () => top.classList.toggle('solid', scrollY > 60);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // menu mobile
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    top.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // revelar ao rolar
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach((el) => io.observe(el));
  } else $$('.reveal').forEach((el) => el.classList.add('in'));

  // lightbox
  const lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap');
  const items = $$('.g');
  let cur = 0, opener = null;
  const show = (i) => {
    cur = (i + items.length) % items.length;
    const { img: src, alt } = items[cur].dataset;
    img.style.backgroundImage = `url(${src}), linear-gradient(135deg,#e4d3b6,#6f7a4f)`;
    img.setAttribute('aria-label', alt);
    cap.textContent = alt;
  };
  const open = (i) => { opener = items[i]; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-x').focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
  items.forEach((b, i) => b.addEventListener('click', () => open(i)));
  $('.lb-x').addEventListener('click', close);
  $('.lb-p').addEventListener('click', () => show(cur - 1));
  $('.lb-n').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === img) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // formulário -> WhatsApp
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const erro = $('#erro');
    erro.hidden = !!(d.nome.trim() && d.tipo);
    if (!erro.hidden) return;
    const data = d.data ? new Date(d.data + 'T12:00').toLocaleDateString('pt-BR') : 'a definir';
    const msg = `Olá! Meu nome é ${d.nome.trim()}. Gostaria de solicitar um orçamento para ${d.tipo.toLowerCase()}.\nData prevista: ${data}\nConvidados: ${d.convidados || 'a definir'}`;
    window.open(wa(msg), '_blank', 'noopener');
  });
})();
