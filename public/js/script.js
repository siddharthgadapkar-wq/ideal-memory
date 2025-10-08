// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const testimonialsSlider = document.getElementById('testimonials-slider');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');

// Global Variables
let currentTestimonial = 0;
let testimonials = [];
let isScrolling = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupContactForm();
    setupTestimonials();
    setupAnimations();
    loadTestimonials();
    setupCounters();
}

// Navigation Functions
function setupNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Active link highlighting
    window.addEventListener('scroll', highlightActiveLink);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification(result.message || 'Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Testimonials
function setupTestimonials() {
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeTestimonial(-1));
        nextBtn.addEventListener('click', () => changeTestimonial(1));
    }
}

async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials/featured');
        const result = await response.json();
        
        if (result.success) {
            testimonials = result.data;
            updateTestimonialDisplay();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Use default testimonials if API fails
        testimonials = getDefaultTestimonials();
        updateTestimonialDisplay();
    }
}

function getDefaultTestimonials() {
    return [
        {
            name: "Sarah Johnson",
            eventType: "Wedding",
            rating: 5,
            testimonial: "Ideal Memory Caterers made our wedding absolutely perfect! Every detail was handled with care and professionalism. The food was exceptional, and the decoration was beyond our expectations.",
            images: [{ path: "images/testimonial-1.jpg" }]
        },
        {
            name: "Michael Chen",
            eventType: "Corporate Event",
            rating: 5,
            testimonial: "Our corporate conference was a huge success thanks to Ideal Memory. The catering was top-notch, and the event coordination was seamless. Highly recommended!",
            images: [{ path: "images/testimonial-2.jpg" }]
        },
        {
            name: "Emily Rodriguez",
            eventType: "Birthday Party",
            rating: 5,
            testimonial: "My daughter's birthday party was magical! The team created an amazing princess theme and the kids had the time of their lives. Thank you for making it special!",
            images: [{ path: "images/testimonial-3.jpg" }]
        }
    ];
}

function changeTestimonial(direction) {
    if (testimonials.length === 0) return;
    
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    updateTestimonialDisplay();
}

function updateTestimonialDisplay() {
    if (!testimonialsSlider || testimonials.length === 0) return;
    
    const testimonial = testimonials[currentTestimonial];
    
    const testimonialCard = testimonialsSlider.querySelector('.testimonial-card');
    if (testimonialCard) {
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="stars">
                    ${generateStars(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.testimonial}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.images?.[0]?.path || 'images/default-avatar.jpg'}" alt="${testimonial.name}" loading="lazy">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.eventType} Client</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-content, .testimonial-card, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter Animation
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 3px;
        transition: background-color 0.2s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || '#3498db';
}

// Service Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Event Registration Form (if exists)
function setupEventRegistration() {
    const eventForm = document.getElementById('event-registration-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventRegistration);
    }
}

async function handleEventRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        venue: formData.get('venue'),
        guestCount: formData.get('guestCount'),
        budget: formData.get('budget'),
        additionalInfo: formData.get('additionalInfo')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Event registration successful! We will contact you soon.', 'success');
            e.target.reset();
        } else {
            showNotification(result.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Initialize event registration if form exists
document.addEventListener('DOMContentLoaded', setupEventRegistration);

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);
