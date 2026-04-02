/* ====================================
   Hack2Hire 1.0 — JavaScript
   Glitch, Typing, Countdown,
   Navbar, Smooth Scroll
   ==================================== */

(function () {
  'use strict';


  // ===== TYPING ANIMATION =====
  const typingElement = document.getElementById('typing-text');
  const phrases = ['Build. Compete. Get Hired.', 'Innovate. Disrupt. Excel.', 'Code. Create. Conquer.'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next phrase
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();


  // ===== COUNTDOWN TIMER =====
  const countdownWrapper = document.querySelector('.countdown-wrapper');
  const deadlineStr = countdownWrapper ? countdownWrapper.getAttribute('data-deadline') : null;
  const deadline = deadlineStr ? new Date(deadlineStr).getTime() : new Date('April 12, 2026 23:59:59').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      document.querySelector('.countdown-label').textContent = 'Registration Closed';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ===== STICKY NAVBAR =====
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;

    // Update active nav link
    updateActiveNavLink();
  });


  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }


  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
    });
  });


  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  // ===== INTERSECTION OBSERVER (Scroll Reveal) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger evaluation bars animation
        if (entry.target.classList.contains('eval-card')) {
          setTimeout(() => {
            entry.target.querySelectorAll('.eval-bar-fill').forEach(bar => {
              bar.style.width = bar.getAttribute('data-width');
            });
          }, 300); // slight delay after card reveals
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and items
  document.querySelectorAll('.about-card, .prize-card, .guideline-item, .contact-card').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });

  // Observe scroll-reveal elements (with staggered delays)
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    const delay = el.dataset.delay ? parseFloat(el.dataset.delay) * 0.2 : 0;
    if (delay > 0) el.style.transitionDelay = `${delay}s`;
    observer.observe(el);
  });

  // Add revealed class styling
  const style = document.createElement('style');
  style.textContent = `
    .scroll-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .revealed { opacity: 1 !important; transform: translateY(0) !important; }
  `;
  document.head.appendChild(style);

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
      // Toggle current
      if (!wasActive) item.classList.add('active');
    });
  });

  // ===== PRELOADER =====
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const introDuration = prefersReducedMotion ? 600 : 3400;

      setTimeout(() => {
        preloader.classList.add('exit');
        document.body.classList.remove('preload-active');
        document.body.classList.add('page-ready');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, introDuration);
    }
  });

  // ===== SCROLL PROGRESS & FLOATING BUTTON =====
  const scrollProgress = document.getElementById('scroll-progress');
  const floatingBtn = document.querySelector('.floating-register');
  const floatingBadge = document.getElementById('floating-badge');
  let scrollTicking = false;
  
  function updateScrollUI() {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (totalScroll / windowHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }
    
    // Floating Button
    if (floatingBtn) {
      if (totalScroll > window.innerHeight * 0.8) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }

    // Hide floating badge when near footer
    if (floatingBadge) {
      if (scrollPercent > 90) {
        floatingBadge.style.opacity = '0';
        floatingBadge.style.pointerEvents = 'none';
      } else {
        floatingBadge.style.opacity = '1';
        floatingBadge.style.pointerEvents = 'auto';
      }
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  });
  // ===== TIMELINE DROPLET ANIMATION =====
  const timelineDroplets = document.querySelector('.timeline-droplets');
  if (timelineDroplets) {
    const icons = [
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
    ];

    function spawnDroplet() {
      const droplet = document.createElement('div');
      droplet.className = 'timeline-logo-droplet';
      
      // Random icon
      const icon = icons[Math.floor(Math.random() * icons.length)];
      droplet.style.backgroundImage = `url(${icon})`;
      
      // Random horizontal position (5% to 95%)
      const x = 5 + Math.random() * 90;
      droplet.style.left = `${x}%`;
      
      // Random height to fall to (different depths within the timeline)
      // We force some to go deeper to cover the whole section
      const sectionHeight = timelineDroplets.offsetHeight;
      const dropY = (0.2 + Math.random() * 0.8) * sectionHeight; 
      droplet.style.setProperty('--drop-y', dropY);
      
      // Constant speed based duration so depth doesn't look rushed
      const duration = 3 + (dropY / 400); 
      droplet.style.animation = `dropletFallPop ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

      timelineDroplets.appendChild(droplet);
      
      // Cleanup
      setTimeout(() => droplet.remove(), duration * 1000);
    }

    // Spawn "one by one" - faster rate for better density over long sections
    setInterval(spawnDroplet, 1200);
  }


  // ===== PARTICLE NETWORK BACKGROUND =====
  class ParticleNetwork {
    constructor() {
      this.canvas = document.getElementById('particle-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = window.innerWidth < 768 ? 30 : window.innerWidth < 1024 ? 60 : 100;
      this.mouse = { x: null, y: null, radius: 150 };
      this.isVisible = true;
      
      this.init();
      this.animate();
      
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
        
        // Move background glow
        const glow = document.getElementById('mouse-glow');
        if (glow) {
          glow.style.left = `${e.clientX}px`;
          glow.style.top = `${e.clientY}px`;
        }
      });
      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    init() {
      this.resize();
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7'
        });
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        
        // Mouse Interaction
        if (this.mouse.x) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.vx += dx / dist * force * 0.1;
            p.vy += dy / dist * force * 0.1;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        
        // Friction / Normalization
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Bounce
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();

        // Lines
        for (let j = i + 1; j < this.particles.length; j++) {
          let p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 150})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }
    }

    animate() {
      if (this.isVisible) {
        this.draw();
      }
      requestAnimationFrame(() => this.animate());
    }
  }

  // ===== TERMINAL OVERLAY SIMULATOR =====
  class TerminalSimulator {
    constructor() {
      this.container = document.getElementById('terminal-overlay');
      this.lines = [
        'Initializing Hack2Hire...',
        'Loading participants...',
        'Connecting to mainframes...',
        'Submissions incoming...',
        'Scanning for high performance...',
        'Encrypting data packets...',
        'Compiling innovative solutions...',
        'Fetching recruitment status...',
        'Optimizing system resources...',
        'Bridge connection established...',
        'Status: ACTIVE',
        'User: ADMIN_SECURE_BY_TJIT',
        'Kernel version 1.0.4 loaded.'
      ];
      this.init();
    }

    init() {
      setInterval(() => this.spawnLine(), 2500);
      // Spawn few initial lines
      for(let i=0; i<5; i++) {
        setTimeout(() => this.spawnLine(), i * 500);
      }
    }

    spawnLine() {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      const text = this.lines[Math.floor(Math.random() * this.lines.length)];
      line.textContent = `> ${new Date().toLocaleTimeString()} :: ${text}`;
      this.container.appendChild(line);
      
      // Cleanup
      setTimeout(() => line.remove(), 20000);
    }
  }


  // FLOATING AI TECH SHAPES REMOVED

  // AI FOOTBALL SIMULATION REMOVED

  // Initialize Enhanced Background Effects
  window.addEventListener('DOMContentLoaded', () => {
    const particleNet = new ParticleNetwork();
    new TerminalSimulator();
    // ShapeSpawner logic removed as requested

    // Pause heavy animations when tab not visible
    document.addEventListener('visibilitychange', () => {
      particleNet.isVisible = !document.hidden;
    });
  });

  // ===== SMOOTH ANCHOR HIGHLIGHT =====
  // Add subtle hover sound effect (visual feedback)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  // ===== ENHANCED MOUSE TRACKING FOR CARDS =====
  document.querySelectorAll('.about-card, .contact-card, .drop-content').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  // ===== ORGANIZER CARD TILT INTERACTION =====
  document.querySelectorAll('.org-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((0.5 - (y / rect.height)) * 8);

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== ENHANCED SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Add stagger delay for children
        const children = entry.target.querySelectorAll('.gl-checklist li, .tag-pill');
        children.forEach((child, idx) => {
          child.style.animationDelay = `${idx * 0.1}s`;
          child.classList.add('stagger-in');
        });
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // ===== PARALLAX SCROLL EFFECT FOR SECTIONS =====
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-gradient-layer, .bg-orb');
    
    parallaxElements.forEach((el, idx) => {
      const speed = 0.3 + (idx * 0.1);
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // ===== BUTTON RIPPLE EFFECT =====
  document.querySelectorAll('.btn, .tag-pill, .org-contact').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== ENHANCED NAV SCROLL EFFECT =====
  let lastScrollTop = 0;
  const navbarElement = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - lastScrollTop) > 50) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbarElement.style.transform = 'translateY(-100%)';
      } else {
        navbarElement.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    navbarElement.style.transition = 'transform 0.3s ease-out';
  });

  // ===== CARD ELEVATION ON SCROLL =====
  document.querySelectorAll('.about-card, .prize-card, .org-card').forEach(card => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
  });

  // ===== INTERACTIVE CURSOR FEEDBACK =====
  document.addEventListener('pointermove', (e) => {
    const glow = document.getElementById('mouse-glow');
    if (glow) {
      const x = e.clientX;
      const y = e.clientY;
      
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      
      // Change glow color based on which section we're in
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          if (section.id === 'timeline') {
            glow.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)';
          } else if (section.id === 'prizes') {
            glow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)';
          }
        }
      });
    }
  });

})();
