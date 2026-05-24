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

});
