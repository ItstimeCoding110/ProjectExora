document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-loaded');
    // ─── 1. Marketing Live Countdown Timer (Session Reset) ───
    const timerElement = document.getElementById('promo-countdown');

    function getSessionEndTime() {
        const storedEnd = sessionStorage.getItem('exora_promo_timer_end');
        const now = Date.now();

        if (storedEnd) {
            const endNum = parseInt(storedEnd, 10);
            if (endNum > now) {
                return endNum;
            }
        }

        // Set fresh marketing timer ~ 11 hours 48 mins 15 secs
        const freshDurationMs = (11 * 3600 + 48 * 60 + 15) * 1000;
        const newEndTime = now + freshDurationMs;
        sessionStorage.setItem('exora_promo_timer_end', newEndTime.toString());
        return newEndTime;
    }

    function updateCountdown() {
        if (!timerElement) return;

        const endTime = getSessionEndTime();
        const now = Date.now();
        let diff = endTime - now;

        if (diff <= 0) {
            sessionStorage.removeItem('exora_promo_timer_end');
            diff = (11 * 3600 + 48 * 60 + 15) * 1000;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formatted = [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        ].join(' : ');

        timerElement.textContent = formatted;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ─── 2. P21: Modern CSS Grid Accordion ───
    const faqEntries = document.querySelectorAll('.faq-entry');

    faqEntries.forEach(entry => {
        const trigger = entry.querySelector('.faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = entry.classList.contains('active');

            // Close other items
            faqEntries.forEach(other => {
                if (other !== entry) {
                    other.classList.remove('active');
                }
            });

            // Toggle current
            entry.classList.toggle('active', !isOpen);
        });
    });

    // ─── 3. Navbar Elevation on Scroll ───
    const navbar = document.getElementById('globalnav');
    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ─── 4. P18: Scroll Reveal (Transitions.dev) ───
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // ─── 5. Storage Progress Bar Animation on Scroll ───
    const progressBars = document.querySelectorAll('.js-progress-bar');
    
    if ('IntersectionObserver' in window && progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-target-width') || '0%';
                    bar.style.width = targetWidth;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    } else {
        progressBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-target-width') || '0%';
        });
    }

    // ─── 6. P26: Spinning Counter / Odometer on Scroll (Transitions.dev) ───
    const counterElements = document.querySelectorAll('.js-counter');

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const type = el.getAttribute('data-type') || 'number';
        const duration = 1200; // ms
        const startTime = performance.now();

        // Ease out cubic-bezier(0.16, 1, 0.3, 1) approximation
        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const currentValue = Math.floor(easedProgress * target);

            if (type === 'currency') {
                el.textContent = `${prefix}${currentValue.toLocaleString('id-ID')}`;
            } else {
                el.textContent = `${prefix}${currentValue}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (type === 'currency') {
                    el.textContent = `${prefix}${target.toLocaleString('id-ID')}`;
                } else {
                    el.textContent = `${prefix}${target}${suffix}`;
                }
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window && counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ─── 7. Smooth Navigation Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navOffset = 56;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── 8. Pricing Card Click-to-White Interaction ───
    const pricingCards = document.querySelectorAll('.pricing-plan-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', () => {
            pricingCards.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
        });
    });

    // ─── 9. Real-time Scroll-Triggered Checkmark Animation (Bi-directional) ───
    const checkItems = document.querySelectorAll('.clean-check-list li');
    if ('IntersectionObserver' in window && checkItems.length > 0) {
        const checkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-checked');
                } else {
                    // Reset saat keluar viewport layar agar bisa beranimasi lagi saat di-scroll kembali
                    entry.target.classList.remove('is-checked');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -10px 0px'
        });

        checkItems.forEach(item => checkObserver.observe(item));
    }
});
