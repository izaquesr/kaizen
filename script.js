
const WHATSAPP = '5511959105383';

// MARQUEE
const mqWords = ['Reels', 'Edição Profissional', 'Roteiros', 'Legendas', 'Estratégia', 'Resultados', 'Engajamento', 'Vendas', 'Crescimento', 'Instagram', 'Criação de Sites'];
const mq = document.getElementById('mq');
const mqH = [...mqWords, ...mqWords, ...mqWords, ...mqWords].map(w => `<span class="marquee-item">${w} <span style="opacity:.4">▸</span></span>`).join('');
mq.innerHTML = mqH + mqH;

// REVEAL
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: .07, rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
initReveal();

// ORC MODAL
let currentPlan = '';
function openOrc(plan) {
    currentPlan = plan || '';
    document.getElementById('orcPlanChip').textContent = currentPlan || 'Serviço não selecionado';
    document.getElementById('orcOverlay').classList.add('show');
    document.getElementById('orcModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('fNome').focus();
}
function closeOrc() {
    document.getElementById('orcOverlay').classList.remove('show');
    document.getElementById('orcModal').classList.remove('show');
    document.body.style.overflow = '';
}

document.getElementById('orcOverlay').addEventListener('click', closeOrc);
document.getElementById('orcClose').addEventListener('click', closeOrc);

// open buttons
document.querySelectorAll('.btn-plan,.btn-site-orcamento,[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => openOrc(btn.dataset.plan || ''));
});
['navOrcBtn', 'navOrcBtn2', 'ctaOrcBtn', 'footerOrcBtn', 'mmOrc', 'customSiteBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); openOrc(el.dataset.plan || ''); });
});

// SEND
document.getElementById('sendWaBtn').addEventListener('click', () => {
    const nome = document.getElementById('fNome').value.trim();
    const neg = document.getElementById('fNegocio').value.trim();
    const msg = document.getElementById('fMsg').value.trim();
    if (!nome || !neg) { showToast('Preencha seu nome e o nome do negócio ✋'); return; }

    let txt = `🚀 *Solicitação de Orçamento — Kezai Digital*\n\n`;
    txt += `👤 *Nome:* ${nome}\n`;
    txt += `🏢 *Negócio:* ${neg}\n`;
    txt += `📦 *Serviço/Plano:* ${currentPlan || 'Não especificado'}\n`;
    if (msg) txt += `💬 *Mensagem:* ${msg}\n`;
    txt += `\n_Aguardo o retorno. Obrigado!_`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`, '_blank');
    showToast('Orçamento enviado! Retorno em breve 🚀');
    closeOrc();
    document.getElementById('fNome').value = '';
    document.getElementById('fNegocio').value = '';
    document.getElementById('fMsg').value = '';
});

// TOAST
function showToast(msg, dur = 2800) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), dur);
}

// MOBILE NAV
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mmClose').addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open')));
/* ── CAROUSEL PLANOS ─────────────────────────────────────────
   Ativo apenas quando plans-container está em modo flex/scroll
   ──────────────────────────────────────────────────────────── */
(function() {
    const container = document.getElementById('plans-container');
    if (!container) return;

    const prevBtn = document.getElementById('c-prev');
    const nextBtn = document.getElementById('c-next');
    const dots = document.querySelectorAll('.c-dot');
    const TOTAL = 3;
    let current = 0;

    function cardWidth() {
        const c = container.querySelector('.plan-card');
        if (!c) return 0;
        const gap = parseFloat(getComputedStyle(container).gap) || 18;
        return c.offsetWidth + gap;
    }

    function isCarousel() {
        return getComputedStyle(container).overflowX === 'auto';
    }

    function syncDots() {
        const cw = cardWidth();
        if (cw > 0) current = Math.round(container.scrollLeft / cw);
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= TOTAL - 1;
    }

    function goTo(idx) {
        if (!isCarousel()) return;
        current = Math.max(0, Math.min(TOTAL - 1, idx));
        container.scrollTo({ left: cardWidth() * current, behavior: 'smooth' });
        syncDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(Number(d.dataset.i))));

    let scrollTimer;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(syncDots, 80);
    }, { passive: true });

    syncDots();

    window.addEventListener('resize', () => {
        current = 0;
        if (isCarousel()) container.scrollTo({ left: 0, behavior: 'instant' });
        syncDots();
    });
})();
