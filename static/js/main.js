/* =========================================================
   HAS - Halil Académie Scientifique
   main.js — interactions du site public
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeaderScroll();
    initFlashBanner();
    initPasswordToggles();
});

/* ---------------------------------------------------------
   Menu mobile (hamburger)
   --------------------------------------------------------- */
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');

    if (!toggle || !nav) return;

    const icon = toggle.querySelector('i');

    const closeNav = () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
        document.body.classList.remove('nav-locked');
    };

    const openNav = () => {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-active');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
        document.body.classList.add('nav-locked');
    };

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'main-nav');

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('is-open');
        isOpen ? closeNav() : openNav();
    });

    // Ferme le menu quand on clique un lien
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    // Ferme le menu si on clique en dehors
    document.addEventListener('click', (event) => {
        const clickedInsideNav = nav.contains(event.target);
        const clickedToggle = toggle.contains(event.target);
        if (!clickedInsideNav && !clickedToggle && nav.classList.contains('is-open')) {
            closeNav();
        }
    });

    // Ferme le menu avec Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            closeNav();
            toggle.focus();
        }
    });

    // Ferme le menu si on repasse en desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && nav.classList.contains('is-open')) {
            closeNav();
        }
    });
}

/* ---------------------------------------------------------
   Header : légère ombre au scroll
   --------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateHeaderState = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/* ---------------------------------------------------------
   Bannière flash : disparition automatique
   --------------------------------------------------------- */
function initFlashBanner() {
    const banner = document.querySelector('.flash-banner');
    if (!banner) return;

    setTimeout(() => {
        banner.style.transition = 'opacity 0.4s ease, max-height 0.4s ease, padding 0.4s ease';
        banner.style.opacity = '0';
        banner.style.maxHeight = banner.offsetHeight + 'px';
        requestAnimationFrame(() => {
            banner.style.maxHeight = '0px';
            banner.style.paddingTop = '0';
            banner.style.paddingBottom = '0';
            banner.style.overflow = 'hidden';
        });
        setTimeout(() => banner.remove(), 450);
    }, 4000);
}

/* ---------------------------------------------------------
   Champs mot de passe : afficher / masquer
   --------------------------------------------------------- */
function initPasswordToggles() {
    const toggles = document.querySelectorAll('[data-password-toggle]');
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
        const inputId = toggle.dataset.passwordToggle;
        const input = document.getElementById(inputId);
        const icon = toggle.querySelector('i');

        if (!input || !icon) return;

        const updateToggleState = (show) => {
            toggle.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
            toggle.classList.toggle('is-visible', show);
            icon.classList.toggle('fa-eye', !show);
            icon.classList.toggle('fa-eye-slash', show);
        };

        toggle.addEventListener('click', () => {
            const shouldShow = input.type === 'password';
            input.type = shouldShow ? 'text' : 'password';
            updateToggleState(shouldShow);
        });

        updateToggleState(false);
    });
}