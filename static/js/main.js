/* =========================================================
   HAS - Halil Académie Scientifique
   main.js — interactions du site public
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeaderScroll();
    initFlashBanner();
    initPasswordToggles();
    initImagePreviews();
    initUploadForms();
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
             icon.classList.toggle('fa-eye-slash', !show);   // œil barré quand CACHÉ
             icon.classList.toggle('fa-eye', show);          // œil normal quand VISIBLE
         };

        toggle.addEventListener('click', () => {
            const shouldShow = input.type === 'password';
            input.type = shouldShow ? 'text' : 'password';
            updateToggleState(shouldShow);
        });

        updateToggleState(false);
    });
}

/* ---------------------------------------------------------
   Prévisualisation immédiate des photos et images
   --------------------------------------------------------- */
function initImagePreviews() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;

            // Validation de taille (max 32 Mo)
            const maxSize = 32 * 1024 * 1024;
            if (file.size > maxSize) {
                alert(`Le fichier sélectionné est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximale autorisée est de 32 Mo.`);
                input.value = '';
                return;
            }

            // Prévisualisation pour les images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Trouver une image d'aperçu dans le conteneur parent
                    const parentForm = input.closest('form') || input.closest('.am-section') || document;
                    const avatarImg = parentForm.querySelector('.am-avatar-xl img, .avatar img, .preview-image');
                    const avatarContainer = parentForm.querySelector('.am-avatar-xl, .avatar');
                    
                    if (avatarImg) {
                        avatarImg.src = e.target.result;
                    } else if (avatarContainer) {
                        avatarContainer.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

/* ---------------------------------------------------------
   Formulaires d'upload : État de chargement et anti-double clic
   --------------------------------------------------------- */
function initUploadForms() {
    const formsWithFiles = document.querySelectorAll('form[enctype="multipart/form-data"]');
    formsWithFiles.forEach((form) => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (!submitBtn) return;

            // Vérifier s'il y a un fichier en cours d'envoi
            const fileInputs = form.querySelectorAll('input[type="file"]');
            let hasFiles = false;
            fileInputs.forEach(fi => {
                if (fi.files && fi.files.length > 0) hasFiles = true;
            });

            if (hasFiles && !submitBtn.disabled) {
                const originalText = submitBtn.innerHTML || submitBtn.value;
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.75';
                submitBtn.style.cursor = 'wait';
                if (submitBtn.tagName.toLowerCase() === 'button') {
                    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...`;
                }
                // Soumettre le formulaire programmatiquement
                form.submit();
            }
        });
    });
}

