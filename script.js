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

    // ─── 10. Testimonials & Lightbox Modal Gallery ───
    const testimonialsContainer = document.getElementById('testimonials-container');
    const allTestimonialsContainer = document.getElementById('all-testimonials-container');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryImages = [];
    let currentGalleryIndex = 0;
    let currentGalleryCaption = '';

    // Starter / Fallback Testimonials Data (Safe for local file:// preview & instant rendering)
    const fallbackTestimonials = [
        {
            id: "exora-t-1788053872245",
            name: "H***s",
            package: "Akun Pribadi (18 Bulan)",
            rating: 5,
            date: "30 Agustus 2026",
            images: [
                "assets/testimonials/testi-1788053865421-1.webp",
                "assets/testimonials/testi-1788053866343-2.webp",
                "assets/testimonials/testi-1788053867087-3.webp"
            ],
            verified: true,
            comment: ""
        },
        {
            id: "exora-t-1788053818716",
            name: "L******y",
            package: "Akun Pribadi (18 Bulan)",
            rating: 5,
            date: "29 Agustus 2026",
            images: [
                "assets/testimonials/testi-1788053797091-1.webp",
                "assets/testimonials/testi-1788053797662-2.webp"
            ],
            verified: true,
            comment: ""
        },
        {
            id: "exora-t-1788053719179",
            name: "C*****y",
            package: "Akun Pribadi (18 Bulan)",
            rating: 5,
            date: "19 Agustus 2026",
            images: [
                "assets/testimonials/testi-1788053704064-1.webp",
                "assets/testimonials/testi-1788053705182-2.webp",
                "assets/testimonials/testi-1788053705703-3.webp"
            ],
            verified: true,
            comment: ""
        },
        {
            id: "exora-t-1788053371249",
            name: "S******i",
            package: "Akun Pribadi (18 Bulan)",
            rating: 5,
            date: "29 Agustus 2026",
            images: [
                "assets/testimonials/testi-1788053320016-1.webp",
                "assets/testimonials/testi-1788053320632-2.webp",
                "assets/testimonials/testi-1788053321485-3.webp"
            ],
            verified: true,
            comment: ""
        }
    ];

    // Render single testimonial card using safe DOM methods
    function renderTestimonialCard(item) {
        const images = item.images || (item.image ? [item.image] : ['assets/testimonials/testi-1788053865421-1.webp']);
        
        const card = document.createElement('div');
        card.className = 'testimonial-card reveal';

        // Image Cover Container
        const imageCover = document.createElement('div');
        imageCover.className = 'testi-image-cover';
        imageCover.title = 'Klik untuk memperbesar bukti transaksi';

        const mainImg = document.createElement('img');
        mainImg.src = images[0];
        mainImg.alt = `Bukti Transaksi ${item.name}`;
        mainImg.loading = 'lazy';
        imageCover.appendChild(mainImg);

        // Photo Count Badge if multi-image
        if (images.length > 1) {
            const countPill = document.createElement('div');
            countPill.className = 'testi-count-pill';
            countPill.textContent = `📸 ${images.length} Bukti`;
            imageCover.appendChild(countPill);
        }

        // Open Lightbox on click
        imageCover.addEventListener('click', () => {
            openLightbox(images, 0, `Bukti Transaksi - ${item.name} (${item.package})`);
        });

        // Card Body
        const body = document.createElement('div');
        body.className = 'testi-body';

        // Meta Head (Name + Verified Tag)
        const metaHead = document.createElement('div');
        metaHead.className = 'testi-meta-head';

        const nameEl = document.createElement('span');
        nameEl.className = 'testi-name';
        nameEl.textContent = item.name;

        const verifiedTag = document.createElement('span');
        verifiedTag.className = 'testi-verified-tag';
        verifiedTag.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Terverifikasi</span>
        `;

        metaHead.appendChild(nameEl);
        metaHead.appendChild(verifiedTag);

        // Package Row + Date
        const pkgRow = document.createElement('div');
        pkgRow.className = 'testi-pkg-row';

        const pkgBadge = document.createElement('span');
        pkgBadge.className = 'testi-pkg-badge';
        pkgBadge.textContent = item.package || 'Akun Pribadi';

        const dateEl = document.createElement('span');
        dateEl.className = 'testi-date';
        dateEl.textContent = item.date || 'Terverifikasi';

        pkgRow.appendChild(pkgBadge);
        pkgRow.appendChild(dateEl);

        // Stars Row
        const starsRow = document.createElement('div');
        starsRow.className = 'testi-stars';
        const ratingNum = item.rating || 5;
        starsRow.textContent = '⭐'.repeat(Math.min(5, Math.max(1, ratingNum)));

        body.appendChild(metaHead);
        body.appendChild(pkgRow);
        body.appendChild(starsRow);

        // Comment / Quote (if any)
        if (item.comment) {
            const quoteEl = document.createElement('p');
            quoteEl.className = 'testi-quote';
            quoteEl.textContent = `“${item.comment}”`;
            body.appendChild(quoteEl);
        }

        // Click to view hint button
        const clickHint = document.createElement('div');
        clickHint.className = 'testi-click-hint';
        clickHint.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Lihat Bukti Screenshot</span>
        `;
        clickHint.addEventListener('click', () => {
            openLightbox(images, 0, `Bukti Transaksi - ${item.name} (${item.package})`);
        });

        body.appendChild(clickHint);

        card.appendChild(imageCover);
        card.appendChild(body);

        return card;
    }

    // Load and render all testimonials
    async function loadTestimonials() {
        const targetContainer = allTestimonialsContainer || testimonialsContainer;
        if (!targetContainer) return;

        let dataToRender = fallbackTestimonials;

        // Fetch from server data/testimonials.json with cache buster
        try {
            const response = await fetch(`data/testimonials.json?v=${Date.now()}`, { cache: 'no-store' });
            if (response.ok) {
                const fetchedData = await response.json();
                if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                    dataToRender = fetchedData;
                }
            }
        } catch (err) {
            // Use fallbackTestimonials if offline
        }

        targetContainer.innerHTML = '';
        dataToRender.forEach(item => {
            const cardEl = renderTestimonialCard(item);
            targetContainer.appendChild(cardEl);
        });

        // Only apply 4-card pagination on index.html (testimonialsContainer)
        if (testimonialsContainer && !allTestimonialsContainer) {
            applyTestimonialLimit();
        }

        // Trigger reveal animation for newly added cards
        if ('IntersectionObserver' in window) {
            const newReveals = targetContainer.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            newReveals.forEach(el => observer.observe(el));
        } else {
            targetContainer.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        }
    }

    // Lightbox Modal Functions
    function openLightbox(images, index, caption) {
        if (!lightboxModal || !images || images.length === 0) return;
        currentGalleryImages = images;
        currentGalleryIndex = index || 0;
        currentGalleryCaption = caption || 'Bukti Transaksi';

        updateLightboxView();
        lightboxModal.classList.add('is-active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('is-active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightboxView() {
        if (currentGalleryImages.length === 0) return;
        lightboxImg.src = currentGalleryImages[currentGalleryIndex];
        lightboxCaption.textContent = currentGalleryCaption;
        
        if (currentGalleryImages.length > 1) {
            lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
            lightboxCounter.style.display = 'block';
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        } else {
            lightboxCounter.style.display = 'none';
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        }
    }

    function nextImage() {
        if (currentGalleryImages.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
        updateLightboxView();
    }

    function prevImage() {
        if (currentGalleryImages.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateLightboxView();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard navigation (ESC, Left, Right)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch Swipe gesture for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightboxModal) {
        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
            if (diff < 0) nextImage();
            else prevImage();
        }
    }

    // ─── 11. Testimonials Pagination (Max 4 Cards on Landing Page) ───
    const MAX_INITIAL_TESTIMONIALS = 4;
    const testiLoadMoreWrap = document.getElementById('testi-load-more-wrap');

    function applyTestimonialLimit() {
        if (!testimonialsContainer) return;
        const allCards = testimonialsContainer.querySelectorAll('.testimonial-card');
        
        if (allCards.length > MAX_INITIAL_TESTIMONIALS) {
            allCards.forEach((card, index) => {
                if (index >= MAX_INITIAL_TESTIMONIALS) {
                    card.classList.add('testi-card-hidden');
                } else {
                    card.classList.remove('testi-card-hidden');
                }
            });
        } else {
            allCards.forEach(card => card.classList.remove('testi-card-hidden'));
        }
        if (testiLoadMoreWrap) testiLoadMoreWrap.style.display = 'flex';
    }

    // Initialize static HTML testimonial cards click handlers immediately
    function initStaticCards() {
        const staticCards = document.querySelectorAll('.testimonial-card[data-images]');
        staticCards.forEach(card => {
            try {
                const images = JSON.parse(card.getAttribute('data-images') || '[]');
                const caption = card.getAttribute('data-caption') || 'Bukti Transaksi';
                const imageCover = card.querySelector('.testi-image-cover');
                const clickHint = card.querySelector('.testi-click-hint');
                if (imageCover) {
                    imageCover.onclick = () => openLightbox(images, 0, caption);
                }
                if (clickHint) {
                    clickHint.onclick = () => openLightbox(images, 0, caption);
                }
            } catch(e) {}
        });
        applyTestimonialLimit();
    }

    initStaticCards();
    loadTestimonials();
});

