/* ════════════════════════════════════════════════════════
   Sarah Bahashwan — Portfolio v3 · JS
   ════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── 1. Backdrop gradient (subdued for mature palette) ─── */
  const initGradient = () => {
    const canvas = document.getElementById('bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;

    // Soft, slow drift — navy/forest/gold instead of pink/lavender/teal
    const blobs = [
      { x: 0.20, y: 0.30, r: 0.55, color: 'rgba(31, 77, 58, 1)',    vx: 0.00010, vy: 0.00008 },
      { x: 0.78, y: 0.25, r: 0.50, color: 'rgba(176, 134, 65, 1)',  vx: -0.00009, vy: 0.00012 },
      { x: 0.55, y: 0.78, r: 0.55, color: 'rgba(14, 27, 46, 1)',    vx: 0.00012, vy: -0.00010 },
      { x: 0.12, y: 0.82, r: 0.40, color: 'rgba(44, 107, 83, 1)',   vx: 0.00007, vy: 0.00009 },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = Math.max(window.innerHeight, 800);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F5F1EA';
      ctx.fillRect(0, 0, w, h);

      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0.05 || b.x > 0.95) b.vx *= -1;
        if (b.y < 0.05 || b.y > 0.95) b.vy *= -1;
        const cx = b.x * w, cy = b.y * h;
        const r = b.r * Math.min(w, h);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(245, 241, 234, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    });
  };

  /* ─── 2. Typer in the hero ─── */
  const initTyper = () => {
    const el = document.getElementById('typer');
    if (!el) return;
    const phrases = [
      'Software Engineering graduate · University of Jeddah · GPA 4.82 · First Class Honours.',
      'Most recently: PMO Intern at Saudi Arabian Airlines · Summer 2025.',
      'Cybersecurity-trained · KAUST Academy · Top 100 of 2,000+ applicants.',
      'Open to full-time roles in Engineering, PM, UI/UX, and more.',
    ];
    let pi = 0, ci = 0, deleting = false;

    const type = () => {
      const phrase = phrases[pi];
      if (deleting) {
        el.textContent = phrase.slice(0, ci--);
        if (ci < 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          ci = 0;
          setTimeout(type, 700);
          return;
        }
      } else {
        el.textContent = phrase.slice(0, ci++);
        if (ci > phrase.length) {
          deleting = true;
          setTimeout(type, 2600);
          return;
        }
      }
      setTimeout(type, deleting ? 22 : 36);
    };
    setTimeout(type, 800);
  };

  /* ─── 3. Jeddah clock ─── */
  const initClock = () => {
    const el = document.getElementById('clock');
    if (!el) return;
    const tick = () => {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      el.textContent = `${hh}:${mm} AST`;
    };
    tick();
    setInterval(tick, 30000);
  };

  /* ─── 4. Year ─── */
  const initYear = () => {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  };

  /* ─── 5. Nav scroll state + mobile menu ─── */
  const initNav = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = document.getElementById('navToggle');
    if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
    nav.querySelectorAll('.nav__links a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('is-open'))
    );
  };

  /* ─── 6. Reveal on scroll ─── */
  const initReveal = () => {
    const items = document.querySelectorAll('.section, .timeline__item, .card, .activity, .project, .cert');
    items.forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), Math.min(i * 50, 250));
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '-50px 0px -10% 0px', threshold: 0.05 }
    );

    items.forEach((el) => io.observe(el));
  };

  /* ─── 7. Cards follow the cursor ─── */
  const initCardCursor = () => {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  };

  /* ─── 8. Skill chips light up matching projects ─── */
  const initSkillLink = () => {
    const chips = document.querySelectorAll('.chip[data-project]');
    const projects = document.querySelectorAll('.project[data-key]');

    chips.forEach((chip) => {
      chip.addEventListener('mouseenter', () => {
        const keys = chip.dataset.project.split(',');
        projects.forEach((p) => {
          if (keys.includes('all') || keys.includes(p.dataset.key)) {
            p.classList.add('is-lit');
          }
        });
      });
      chip.addEventListener('mouseleave', () => {
        projects.forEach((p) => p.classList.remove('is-lit'));
      });
    });
  };

  /* ─── 9. Experience card → certificate lightbox ─── */
  const initExperienceCerts = () => {
    const box   = document.getElementById('lightbox');
    const inner = document.getElementById('lightboxInner');
    if (!box || !inner) return;

    document.querySelectorAll('.card--clickable[data-cert-image]').forEach((card) => {
      card.addEventListener('click', () => {
        const src    = card.dataset.certImage;
        const name   = card.dataset.certName   || '';
        const issuer = card.dataset.certIssuer || '';
        const date   = card.dataset.certDate   || '';
        inner.innerHTML = `
          <img src="${src}" alt="${name}"
               onerror="this.outerHTML='<div style=\\'padding:2.5rem;text-align:center;font-family:var(--f-mono);font-size:.85rem;color:var(--mute);line-height:1.8\\'><strong style=\\'color:var(--ink)\\'>Certificate image not found</strong><br>Add the file at:<br><code style=\\'color:var(--forest)\\'>${src}</code></div>'" />
          <div class="lightbox__caption">
            <strong>${name}</strong>
            <span>${issuer}${date ? ' · ' + date : ''}</span>
          </div>`;
        box.classList.add('is-open');
        box.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
    });
  };

  /* ─── 10. Activity gallery modal ─── */
  const initActivityGallery = () => {
    const modal   = document.getElementById('galleryModal');
    const closeBtn = document.getElementById('galleryClose');
    const grid    = document.getElementById('galleryGrid');
    const titleEl = document.getElementById('galleryTitle');
    if (!modal || !closeBtn || !grid || !titleEl) return;

    const hideModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.activity[data-gallery-title]').forEach((item) => {
      item.addEventListener('click', () => {
        const title  = item.dataset.galleryTitle || '';
        const images = (item.dataset.gallery || '').split(',').map(s => s.trim()).filter(Boolean);
        titleEl.textContent = title;

        if (images.length === 0) {
          grid.innerHTML = `<div class="gallery-modal__empty"><strong>Photos coming soon!</strong>Drop images in <code>assets/gallery/</code> then add their paths to the <code>data-gallery</code> attribute on this activity.</div>`;
        } else {
          const lb = document.getElementById('lightbox');
          const lbInner = document.getElementById('lightboxInner');
          grid.innerHTML = images.map(src =>
            `<img src="${src}" alt="${title}" loading="lazy" onerror="this.style.display='none'" />`
          ).join('');
          grid.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => {
              if (!lb || !lbInner) return;
              lbInner.innerHTML = `<img src="${img.src}" alt="${title}" />`;
              lb.classList.add('is-open');
              lb.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
            });
          });
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) hideModal();
    });
  };

  /* ─── 11. Project detail modal ─── */
  const initProjectDetails = () => {
    const modal    = document.getElementById('projectModal');
    const closeBtn = document.getElementById('projectModalClose');
    if (!modal || !closeBtn) return;

    const extras = {
      noor:     { skills: ['Flutter', 'Firebase', 'Python', 'Flask', 'scikit-learn', 'Sentence-BERT', 'NLP', 'Agile/Scrum'],
                  images: ['assets/project/Noor_Al-tareeq.jpg'],
                  pdf: 'assets/pdf/Noor Al-Tariq_SeniorProject2_G20.pdf' },
      jetsetgo: { skills: ['JIRA', 'Lucidchart', 'Requirements Engineering', 'UML', 'System Architecture', 'SDLC'],
                  images: ['assets/project/jetSetgo1.jpg', 'assets/project/JetSetGo2.jpg', 'assets/project/jetsetGo.jpg'],
                  pdf: 'assets/pdf/JetSetGo (software process model project) (3).pdf' },
      rental:   { skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'UI/UX'],
                  images: [],
                  pdf: 'assets/pdf/_Project-Phase #1 _2 Web Development (2).pdf' },
      gotcha:   { skills: ['React', 'User Research', 'Prototyping', 'Usability Testing', 'Figma'],
                  images: ['assets/project/gotch.jpg'],
                  pdf: 'assets/pdf/_final Gotcha.pdf' },
      network:  { skills: ['Cisco Packet Tracer', 'Wireshark', 'OSPF', 'VLAN', 'Network Security', 'C++'],
                  images: ['assets/project/network_project .jpg'],
                  pdf: 'assets/pdf/network project ff.pdf' },
      employee: { skills: ['Java', 'SQL', 'JDBC', 'Database Design', 'Normalization'],
                  images: ['assets/project/employee managment system .jpg'],
                  pdf: 'assets/pdf/Employee Management System.pdf' },
    };

    const hideModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.project').forEach((proj) => {
      proj.style.cursor = 'pointer';
      proj.addEventListener('click', () => {
        if (proj.dataset.href) { window.open(proj.dataset.href, '_blank', 'noopener'); return; }

        const key   = proj.dataset.key || '';
        const info  = extras[key] || { skills: [], images: [], pdf: null };
        const title = proj.querySelector('h3')?.textContent || '';
        const role  = proj.querySelector('.project__role')?.textContent || '';
        const desc  = proj.querySelector('.project__body p:last-child')?.textContent || '';
        const num   = proj.querySelector('.project__num')?.textContent || '';

        document.getElementById('pmNum').textContent   = num;
        document.getElementById('pmTitle').textContent = title;
        document.getElementById('pmRole').textContent  = role;
        document.getElementById('pmDesc').textContent  = desc;
        document.getElementById('pmTags').innerHTML    = info.skills.map(s => `<span>${s}</span>`).join('');

        // PDF button — appears only when pdf path is set in extras
        const existingPdf = document.getElementById('pmPdfBtn');
        if (existingPdf) existingPdf.remove();
        if (info.pdf) {
          const pdfBtn = document.createElement('a');
          pdfBtn.id = 'pmPdfBtn';
          pdfBtn.href = info.pdf;
          pdfBtn.target = '_blank';
          pdfBtn.rel = 'noopener';
          pdfBtn.className = 'btn btn--ghost project-modal__pdf-btn';
          pdfBtn.textContent = 'View Report (PDF) ↗';
          document.getElementById('pmTags').after(pdfBtn);
        }

        // Images
        const mediaEl = document.getElementById('pmMedia');
        if (info.images && info.images.length > 0) {
          mediaEl.className = 'project-modal__media-grid';
          mediaEl.innerHTML = info.images.map(src =>
            `<img src="${src}" alt="${title}" loading="lazy" onerror="this.style.display='none'" />`
          ).join('');
          const lb = document.getElementById('lightbox');
          const lbInner = document.getElementById('lightboxInner');
          if (lb && lbInner) {
            mediaEl.querySelectorAll('img').forEach(img => {
              img.addEventListener('click', () => {
                lbInner.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
                lb.classList.add('is-open');
                lb.setAttribute('aria-hidden', 'false');
              });
            });
          }
        } else {
          mediaEl.className = 'project-modal__media';
          mediaEl.innerHTML = `Preview coming soon.`;
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) hideModal();
    });
  };

  /* ─── 10. Cert lightbox — handles real images ─── */
  const initLightbox = () => {
    const box = document.getElementById('lightbox');
    const inner = document.getElementById('lightboxInner');
    const close = document.getElementById('lightboxClose');
    if (!box || !inner || !close) return;

    document.querySelectorAll('.cert').forEach((cert) => {
      cert.addEventListener('click', () => {
        const img = cert.querySelector('.cert__img');
        const issuer = cert.dataset.certIssuer || '';
        const name = cert.dataset.certName || '';
        const date = cert.dataset.certDate || '';

        // If we have a real image AND it loaded successfully, show it.
        if (img && img.naturalWidth > 0 && img.style.display !== 'none') {
          inner.innerHTML = `
            <img src="${img.src}" alt="${name}" />
            <div class="lightbox__caption">
              <strong>${name}</strong>
              <span>${issuer} · ${date}</span>
            </div>
          `;
        } else {
          // Fallback — show the text card big
          const face = cert.querySelector('.cert__face');
          if (face) {
            inner.innerHTML = face.outerHTML;
            const f = inner.querySelector('.cert__face');
            if (f) f.style.display = 'flex';
          }
        }
        box.classList.add('is-open');
        box.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const hide = () => {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    close.addEventListener('click', hide);
    box.addEventListener('click', (e) => { if (e.target === box) hide(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  };

  /* ─── 11. Contact form feedback ─── */
  const initForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = 'Opening mail client…';
        setTimeout(() => { btn.innerHTML = original; }, 2500);
      }
    });
  };

  /* ─── 12. Easter egg ─── */
  const initEaster = () => {
    const dot = document.getElementById('easter');
    if (!dot) return;
    const messages = [
      'Thanks for reading this far.',
      'Open to roles — sarahbahashwan1@hotmail.com',
      'Built by hand. Coffee was involved.',
      'Salam · مرحبا · Hello.',
    ];
    let i = 0;
    dot.addEventListener('click', () => {
      const tip = document.createElement('div');
      tip.textContent = messages[i % messages.length];
      i++;
      Object.assign(tip.style, {
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%) translateY(10px)',
        background: 'var(--ink)',
        color: 'var(--paper)',
        padding: '0.7rem 1.2rem',
        borderRadius: '4px',
        fontFamily: 'var(--f-mono)',
        fontSize: '0.78rem',
        opacity: '0',
        transition: 'opacity 0.4s, transform 0.4s',
        zIndex: '60',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        maxWidth: '90vw',
      });
      document.body.appendChild(tip);
      requestAnimationFrame(() => {
        tip.style.opacity = '1';
        tip.style.transform = 'translateX(-50%) translateY(0)';
      });
      setTimeout(() => {
        tip.style.opacity = '0';
        setTimeout(() => tip.remove(), 400);
      }, 2400);
    });
  };

  /* ─── Boot ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initGradient();
    initTyper();
    initClock();
    initYear();
    initNav();
    initReveal();
    initCardCursor();
    initSkillLink();
    initExperienceCerts();
    initActivityGallery();
    initProjectDetails();
    initLightbox();
    initForm();
    initEaster();
  });
})();
