// Initialisation des animations AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Effet de parallaxe pour le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Animation du texte du hero
const heroText = "Votre Partenaire de Confiance pour la Réussite Internationale";
const heroElement = document.querySelector('.hero .tagline');
let index = 0;

function typeWriter() {
    if (index < heroText.length) {
        heroElement.textContent = heroText.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 50);
    }
}

// Démarrer l'animation d'écriture après le chargement de la page
window.addEventListener('load', typeWriter);

// Animation des statistiques
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observer pour déclencher l'animation des stats au scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-item h3');
            stats.forEach(stat => {
                const endValue = parseInt(stat.textContent);
                stat.textContent = '0';
                animateValue(stat, 0, endValue, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Animation des cartes de service
const serviceCards = document.querySelectorAll('.service-category');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Animation des pays dans la section immigration
const countryItems = document.querySelectorAll('.country-item');
countryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.1)';
        item.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

// Gestion du formulaire de contact avec validation
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea, select');

formInputs.forEach(input => {
    const label = document.createElement('span');
    label.className = 'floating-label';
    label.textContent = input.placeholder;
    input.parentNode.insertBefore(label, input);

    input.addEventListener('focus', () => {
        label.classList.add('active');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            label.classList.remove('active');
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation du formulaire
    let isValid = true;
    const formData = {};

    formInputs.forEach(input => {
        formData[input.id] = input.value.trim();
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        document.getElementById('email').classList.add('error');
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    // Animation de chargement
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    try {
        // Simulation d'envoi du formulaire
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Message envoyé avec succès!', 'success');
        contactForm.reset();
        formInputs.forEach(input => {
            input.classList.remove('active');
        });
    } catch (error) {
        showNotification('Une erreur est survenue', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer le message';
    }
});

// Système de notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Animation de sortie
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Menu mobile amélioré
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Fermeture du menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Animation du header au scroll
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajout de la classe scrolled pour le changement de style
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Animation de masquage/affichage
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });

    // Animation des statistiques
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 secondes
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;

            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.round(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            updateStat();
        });
    };

    // Observer pour déclencher l'animation des stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelector('.hero-stats')?.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Bouton retour en haut
    const scrollTop = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Animation du texte d'en-tête
    const typeWriter = (text, element, speed = 100) => {
        let i = 0;
        element.textContent = '';
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    };

    const heroTitle = document.querySelector('.typewriter');
    if (heroTitle) {
        typeWriter(heroTitle.textContent, heroTitle);
    }

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message envoyé avec succès!', 'success');
                contactForm.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Système de notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
