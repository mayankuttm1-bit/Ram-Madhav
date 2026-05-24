/* ============================================
   main.js — Ram Madhav Real Estate
   Handles: Navigation, Scroll Animations,
   FAQ Accordion, Form, WhatsApp Float
============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Mobile Menu Toggle ───
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // ─── Sticky Header ───
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Run on load
    }

    // ─── Scroll Animations (IntersectionObserver) ───
    const animElements = document.querySelectorAll('.anim');

    if ('IntersectionObserver' in window && animElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback
        animElements.forEach(el => el.classList.add('visible'));
    }

    // ─── Counter Animation (for highlight numbers) ───
    const counterElements = document.querySelectorAll('.highlight-number');

    if ('IntersectionObserver' in window && counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();
                    const match = text.match(/^(\d+)(.*)$/);
                    if (match) {
                        const target = parseInt(match[1]);
                        const suffix = match[2];
                        animateCounter(el, target, suffix);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el, target, suffix) {
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current + suffix;
        }, 25);
    }

    // ─── FAQ Accordion ───
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                faqItems.forEach(faq => faq.classList.remove('active'));
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ─── Form Submission Handler ───
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('inquiry-name')?.value;
            const phone = document.getElementById('inquiry-phone')?.value;
            const email = document.getElementById('inquiry-email')?.value;
            const interest = document.getElementById('inquiry-interest')?.value;
            const message = document.getElementById('inquiry-message')?.value;

            // Build WhatsApp message
            const waMessage = encodeURIComponent(
                `Hello Ram Madhav Real Estate!\n\n` +
                `Name: ${name}\n` +
                `Phone: ${phone}\n` +
                `Email: ${email || 'N/A'}\n` +
                `Interested In: ${interest || 'General Inquiry'}\n` +
                `Message: ${message || 'N/A'}\n\n` +
                `Please get back to me at your earliest convenience.`
            );

            // Show success notification
            showNotification('Thank you! Your inquiry has been submitted. Redirecting to WhatsApp...');

            // Open WhatsApp after a short delay
            setTimeout(() => {
                window.open(`https://wa.me/919111280169?text=${waMessage}`, '_blank');
            }, 1500);

            inquiryForm.reset();
        });
    }

    // ─── Notification System ───
    function showNotification(message) {
        // Remove existing
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // ─── Smooth Scroll for Anchor Links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Preloader ───
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 600);
        });
        // Fallback: hide after 3s max
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 3000);
    }

    // ─── Custom Cursor (Desktop Only) ───
    const cursor = document.getElementById('customCursor');
    if (cursor && window.matchMedia('(min-width: 1025px)').matches && !('ontouchstart' in window)) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
            if (!cursor.classList.contains('active')) {
                cursor.classList.add('active');
            }
        });

        // Expand cursor on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .testimonial-card, .highlight-card, .insight-card, input, select, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        document.addEventListener('mouseenter', () => cursor.classList.add('active'));
    }

    // ─── Parallax Scrolling ───
    const parallaxBgs = document.querySelectorAll('.hero-bg, .testimonials-bg, .site-visit-bg');
    if (parallaxBgs.length > 0 && window.matchMedia('(min-width: 769px)').matches) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    parallaxBgs.forEach(bg => {
                        const section = bg.closest('section');
                        if (section) {
                            const rect = section.getBoundingClientRect();
                            const sectionTop = rect.top + scrollY;
                            const offset = (scrollY - sectionTop) * 0.35;
                            if (rect.top < window.innerHeight && rect.bottom > 0) {
                                bg.style.transform = `translateY(${offset}px)`;
                            }
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ─── Smooth Page Transitions ───
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });

    // ─── Testimonials Slider ───
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        const totalSlides = cards.length;
        let startX = 0;
        let isDragging = false;
        let dragOffset = 0;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        function getSlideWidth() {
            if (!cards[0]) return 0;
            const style = getComputedStyle(track);
            const gap = parseInt(style.gap) || 32;
            return cards[0].offsetWidth + gap;
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Touch / Drag support
        const wrapper = track.parentElement;
        wrapper.addEventListener('mousedown', (e) => { isDragging = true; startX = e.pageX; track.style.transition = 'none'; });
        wrapper.addEventListener('touchstart', (e) => { isDragging = true; startX = e.touches[0].pageX; track.style.transition = 'none'; }, { passive: true });

        const onMove = (pageX) => {
            if (!isDragging) return;
            dragOffset = pageX - startX;
            track.style.transform = `translateX(${-currentIndex * getSlideWidth() + dragOffset}px)`;
        };
        wrapper.addEventListener('mousemove', (e) => onMove(e.pageX));
        wrapper.addEventListener('touchmove', (e) => onMove(e.touches[0].pageX), { passive: true });

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            if (dragOffset < -60) goToSlide(currentIndex + 1);
            else if (dragOffset > 60) goToSlide(currentIndex - 1);
            else goToSlide(currentIndex);
            dragOffset = 0;
        };
        wrapper.addEventListener('mouseup', onEnd);
        wrapper.addEventListener('mouseleave', onEnd);
        wrapper.addEventListener('touchend', onEnd);

        // Auto-slide every 5s
        let autoSlide = setInterval(() => {
            goToSlide(currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1);
        }, 5000);

        wrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
        wrapper.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                goToSlide(currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1);
            }, 5000);
        });
    }

});
