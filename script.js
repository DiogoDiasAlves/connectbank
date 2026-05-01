/* Connecti Financiamentos - JS */

var bancosData = {
  itau: {
    nome: 'Itau',
    modalidades: [
      { label: 'Personnalite - a partir de 11,70% a.a. + T.R.', taxa: 11.70, prazoMax: 420 },
      { label: 'Uniclass - a partir de 12,00% a.a. + T.R.', taxa: 12.00, prazoMax: 420 },
      { label: 'Agencias / Nao Correntista - 13,45% a.a. + T.R.', taxa: 13.45, prazoMax: 420 }
    ]
  },
  bradesco: {
    nome: 'Bradesco',
    modalidades: [
      { label: 'Principal - a partir de 11,70% a.a. + T.R.', taxa: 11.70, prazoMax: 420 },
      { label: 'Prime - a partir de 11,99% a.a. + T.R.', taxa: 11.99, prazoMax: 420 },
      { label: 'Residencial Parcerias - 12,30% a.a. + T.R.', taxa: 12.30, prazoMax: 420 }
    ]
  },
  santander: {
    nome: 'Santander',
    modalidades: [
      { label: 'PF SAC - a partir de 11,69% a.a. + T.R.', taxa: 11.69, prazoMax: 420 },
      { label: 'PF PRICE - a partir de 14,04% a.a. + T.R.', taxa: 14.04, prazoMax: 420 },
      { label: 'Comercial PRICE/SAC - 11,79% a.a. + T.R.', taxa: 11.79, prazoMax: 360 }
    ]
  },
  inter: {
    nome: 'Banco Inter',
    modalidades: [
      { label: 'PF Residencial - a partir de 9,50% a.a. + IPCA', taxa: 9.50, prazoMax: 420 },
      { label: 'PJ Residencial - a partir de 12,00% a.a. + IPCA', taxa: 12.00, prazoMax: 240 },
      { label: 'Comercial/Terreno - 12,00% a.a. + IPCA', taxa: 12.00, prazoMax: 240 }
    ]
  }
};

/* ==========================================
   CANVAS DE PARTICULAS - HERO
   ========================================== */
(function initCanvas() {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var particles = [];
  for (var k = 0; k < 70; k++) particles.push(mkP());

  function mkP() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.05,
      alpha: Math.random() * 0.45 + 0.1,
      gold: Math.random() > 0.6,
      pulse: Math.random() * 6.28,
      ps: 0.01 + Math.random() * 0.01
    };
  }

  function drawLines() {
    var MAX = 110;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(201,168,76,' + ((1 - d / MAX) * 0.1) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += p.ps;
      var a = Math.min(p.alpha + Math.sin(p.pulse) * 0.1, 0.7);
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.28);
      ctx.fillStyle = p.gold ? 'rgba(201,168,76,' + a + ')' : 'rgba(255,255,255,' + (a * 0.7) + ')';
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ==========================================
   CARROSSEL DE IMOVEIS
   ========================================== */
(function initCarousel() {
  var track = document.getElementById('carouselTrack');
  var dotsWrap = document.getElementById('carouselDots');
  var btnPrev = document.getElementById('carouselPrev');
  var btnNext = document.getElementById('carouselNext');
  if (!track) return;

  var slides = track.querySelectorAll('.carousel-slide');
  var current = 0;
  var timer;

  for (var k = 0; k < slides.length; k++) {
    (function(i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function() { goTo(i); });
      dotsWrap.appendChild(dot);
    })(k);
  }

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(function() { goTo(current + 1); }, 5000);
  }

  slides[0].classList.add('active');
  if (btnPrev) btnPrev.addEventListener('click', function() { goTo(current - 1); });
  if (btnNext) btnNext.addEventListener('click', function() { goTo(current + 1); });

  var startX = 0;
  track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });

  timer = setInterval(function() { goTo(current + 1); }, 5000);
})();

/* ==========================================
   LOGO WATERMARK - SECAO SOBRE
   ========================================== */
(function initWatermark() {
  var el = document.querySelector('.sobre-logo-watermark');
  if (!el) return;
  el.style.opacity = '0';
  if (!window.IntersectionObserver) { el.style.opacity = '0.05'; return; }
  var io = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      el.style.transition = 'opacity 1.6s ease';
      el.classList.add('wm-visible');
      io.disconnect();
    }
  }, { threshold: 0.1 });
  io.observe(el);
})();

/* ==========================================
   NAVBAR SCROLL
   ========================================== */
var navbar = document.getElementById('navbar');
var heroEl = document.getElementById('inicio');
function updateNavbar() {
  if (!navbar) return;
  var y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  var heroH = heroEl ? heroEl.getBoundingClientRect().height : 0;
  /* Evita past-hero errado se altura ainda não foi calculada */
  var threshold = heroH > 120 ? heroH - 72 : 99999;
  var pastHero = y > threshold;
  navbar.classList.toggle('past-hero', pastHero);
}
window.addEventListener('scroll', updateNavbar);
window.addEventListener('resize', updateNavbar);
window.addEventListener('load', updateNavbar);
updateNavbar();

/* ==========================================
   HAMBURGER MENU
   ========================================== */
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
  var spans = hamburger.querySelectorAll('span');
  var open = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(function(s) {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* ==========================================
   TAXAS TABS
   ========================================== */
document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ==========================================
   SIMULADOR
   ========================================== */
var bancoAtual = 'itau';

function atualizarModalidades(banco) {
  var sel = document.getElementById('modalidade');
  sel.innerHTML = '';
  bancosData[banco].modalidades.forEach(function(m, i) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = m.label;
    sel.appendChild(opt);
  });
  var pr = document.getElementById('prazoRange');
  var mx = bancosData[banco].modalidades[0].prazoMax;
  pr.max = mx;
  if (parseInt(pr.value) > mx) {
    pr.value = mx;
    document.getElementById('prazoDisplay').textContent = mx + ' meses';
  }
}

document.querySelectorAll('.bank-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.bank-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    bancoAtual = btn.dataset.bank;
    document.getElementById('resultBankName').textContent = bancosData[bancoAtual].nome;
    atualizarModalidades(bancoAtual);
    resetResult();
  });
});

var prazoRange = document.getElementById('prazoRange');
var prazoDisplay = document.getElementById('prazoDisplay');
prazoRange.addEventListener('input', function() {
  prazoDisplay.textContent = prazoRange.value + ' meses';
});

function mascaraMoeda(input) {
  input.addEventListener('input', function() {
    var raw = input.value.replace(/\D/g, '');
    if (!raw) { input.value = ''; return; }
    input.value = parseInt(raw, 10).toLocaleString('pt-BR');
  });
}
mascaraMoeda(document.getElementById('valorImovel'));
mascaraMoeda(document.getElementById('entrada'));

function parseMoeda(str) {
  return parseFloat((str || '').replace(/\./g, '').replace(',', '.')) || 0;
}
function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcSAC(pv, taxaAnual, meses) {
  var i = taxaAnual / 100 / 12;
  var A = pv / meses;
  var p1 = A + pv * i;
  var pN = A + (pv - (meses - 1) * A) * i;
  var total = 0;
  for (var k = 1; k <= meses; k++) total += A + (pv - (k - 1) * A) * i;
  return { p1: p1, pN: pN, total: total };
}
function calcPRICE(pv, taxaAnual, meses) {
  var i = taxaAnual / 100 / 12;
  var pmt = pv * i / (1 - Math.pow(1 + i, -meses));
  return { pmt: pmt, total: pmt * meses };
}

document.getElementById('btnCalcular').addEventListener('click', function() {
  var valorImovel = parseMoeda(document.getElementById('valorImovel').value);
  var entrada = parseMoeda(document.getElementById('entrada').value);
  var prazo = parseInt(prazoRange.value);
  var sistema = document.getElementById('sistema').value;
  var modalIdx = parseInt(document.getElementById('modalidade').value);
  var modalidade = bancosData[bancoAtual].modalidades[modalIdx];

  if (!valorImovel || valorImovel <= 0) { alert('Informe o valor do imovel.'); return; }
  if (entrada >= valorImovel) { alert('A entrada deve ser menor que o valor do imovel.'); return; }

  var financiado = valorImovel - entrada;
  var taxaAnual = modalidade.taxa;
  var p1, pUltima, total;

  if (sistema === 'SAC') {
    var r = calcSAC(financiado, taxaAnual, prazo);
    p1 = r.p1; pUltima = r.pN; total = r.total;
  } else {
    var r2 = calcPRICE(financiado, taxaAnual, prazo);
    p1 = r2.pmt; pUltima = r2.pmt; total = r2.total;
  }

  document.getElementById('result1aParcela').textContent = formatBRL(p1);
  document.getElementById('resultFinanciado').textContent = formatBRL(financiado);
  document.getElementById('resultUltimaParcela').textContent = sistema === 'SAC' ? formatBRL(pUltima) : '= parcela fixa (PRICE)';
  document.getElementById('resultTaxa').textContent = taxaAnual.toFixed(2).replace('.', ',') + '% a.a.';
  document.getElementById('resultPrazo').textContent = prazo + ' meses';
  document.getElementById('resultTotal').textContent = formatBRL(total);

  var el = document.getElementById('result1aParcela');
  var frames = 30, frame = 0;
  var t = setInterval(function() {
    frame++;
    el.textContent = formatBRL(p1 * (1 - Math.pow(1 - frame / frames, 3)));
    if (frame >= frames) clearInterval(t);
  }, 16);
});

function resetResult() {
  ['result1aParcela','resultFinanciado','resultUltimaParcela','resultTaxa','resultPrazo','resultTotal'].forEach(function(id) {
    document.getElementById(id).textContent = '-';
  });
}

/* ==========================================
   FORMULARIO DE CONTATO
   ========================================== */
document.getElementById('contatoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(function() {
    btn.textContent = 'Solicitacao enviada!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    e.target.reset();
    setTimeout(function() {
      btn.textContent = 'Enviar solicitacao';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }, 1200);
});

/* ==========================================
   ANIMACOES AO SCROLL
   ========================================== */
var scrollObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.servico-card,.taxa-card,.step,.sobre-text,.sobre-img-wrap,.contato-info,.contato-form-box').forEach(function(el, i) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .5s ease ' + (i * 0.06) + 's, transform .5s ease ' + (i * 0.06) + 's';
  scrollObs.observe(el);
});

/* ==========================================
   INICIALIZACAO
   ========================================== */
atualizarModalidades('itau');
