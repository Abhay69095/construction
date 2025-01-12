// At the very top of script.js, add console logs to verify Firebase initialization
console.log('Initializing Firebase...');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqh33kJLnrqoewy45vAZX-tS2kAyBMugI",
    authDomain: "construction-721da.firebaseapp.com",
    projectId: "construction-721da",
    storageBucket: "construction-721da.firebasestorage.app",
    messagingSenderId: "285803522336",
    appId: "1:285803522336:web:b36df33957bbd78a560f45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

console.log('Firebase initialized successfully');

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop = 0;
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to Top Button
const scrollBtn = document.createElement("button");
scrollBtn.innerHTML = "↑";
scrollBtn.setAttribute("id", "scroll-btn");
document.body.appendChild(scrollBtn);

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate on Scroll
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
    observer.observe(element);
});

// Stats Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 20);
}

// Initialize stats animation when scrolled into view
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-item h3').forEach(stat => {
            const target = parseInt(stat.textContent);
            animateCounter(stat, target);
        });
        statsObserver.unobserve(entries[0].target);
    }
}, observerOptions);

statsObserver.observe(statsSection);

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('Form submitted'); // Debug log
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Get form data
            const templateParams = {
                to_name: 'Construction Company',
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                service_type: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            console.log('Template params:', templateParams); // Debug log

            try {
                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_8ryvi07',  // Verify this service ID
                    'template_q0vhup8',  // Verify this template ID
                    templateParams,
                    'TvnAoLSEvDqoYWaXx'  // Your public key
                );

                console.log('Email sent successfully:', response);
                showAlert('success', 'Thank you! Your message has been sent.');
                contactForm.reset();
            } catch (error) {
                console.error('Failed to send email:', error);
                showAlert('error', 'Failed to send message. Please try again.');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error('Contact form not found!'); // Debug log
    }
});

// Alert function (if not already defined)
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Add this to test if the form is properly initialized
console.log('Form handler initialized:', !!document.getElementById('contactForm'));

// Add this to test if EmailJS is properly initialized
console.log('EmailJS loaded:', typeof emailjs !== 'undefined');

// Add some CSS for the scroll button
const style = document.createElement('style');
style.textContent = `
    #scroll-btn {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99;
        border: none;
        outline: none;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        padding: 15px;
        border-radius: 50%;
        font-size: 18px;
        transition: all 0.3s ease;
    }

    #scroll-btn:hover {
        background-color: #0056b3;
    }

    .nav-active {
        transform: translateX(0%) !important;
    }

    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }
`;
document.head.appendChild(style);

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('nav-overlay');
body.appendChild(overlay);

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
});

// Close menu when clicking overlay
overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';
});

// Close menu when clicking nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close menu on window resize if open
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
});

// Hero Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // Create dots for each slide
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dots.appendChild(dot);
    });

    // Function to update slides
    function updateSlides() {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.dot')[currentSlide].classList.add('active');
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    // Function to go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Function to go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
        resetInterval();
    }

    // Function to start auto sliding
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Function to reset interval
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Event listeners for buttons
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    // Pause slideshow on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        startSlideShow();
    });

    // Start the slideshow
    startSlideShow();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetInterval();
        }
    }
});

// DOM Elements
let loginPopup, signupPopup, loginBtn, signupBtn, closeButtons;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    setupEventListeners();
    setupFormHandlers();
    
    // Log elements to verify they exist
    console.log('Login Form:', document.getElementById('loginForm'));
    console.log('Signup Form:', document.getElementById('signupForm'));
    console.log('Login Button:', document.getElementById('loginBtn'));
    console.log('Signup Button:', document.getElementById('signupBtn'));
});

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Get all login and signup buttons (both mobile and desktop)
    const allLoginBtns = document.querySelectorAll('#loginBtn, #showLogin');
    const allSignupBtns = document.querySelectorAll('#signupBtn, #showSignup');
    
    console.log('Login buttons found:', allLoginBtns.length);
    console.log('Signup buttons found:', allSignupBtns.length);
    
    // Add click handlers to all login buttons
    allLoginBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Login button clicked');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'block';
            }
        });
    });

    // Add click handlers to all signup buttons
    allSignupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Signup button clicked');
            const signupModal = document.getElementById('signupModal');
            if (signupModal) {
                signupModal.style.display = 'block';
            }
        });
    });

    // Close modals with close button
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.style.display = 'none');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Switch between login and signup
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('signupModal').style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signupModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        });
    }

    // Add Google Sign-In handler
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                // Get user info
                const user = result.user;
                
                // Store additional user data in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    lastLogin: new Date().toISOString()
                }, { merge: true });

                showAlert('success', 'Signed in successfully with Google!');
                document.getElementById('loginModal').style.display = 'none';
            } catch (error) {
                showAlert('error', error.message);
            }
        });
    }
}

function setupFormHandlers() {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = loginForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            
            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                console.log('Attempting login with:', email); // Debug log
                
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Login successful:', userCredential.user); // Debug log
                
                showAlert('success', 'Logged in successfully!');
                document.getElementById('loginModal').style.display = 'none';
                loginForm.reset();
            } catch (error) {
                console.error('Login error:', error); // Debug log
                showAlert('error', error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if(signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = signupForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            
            try {
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const name = document.getElementById('signupName').value;
                const phone = document.getElementById('signupPhone').value;

                console.log('Attempting signup with:', email); // Debug log
                
                // Create user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Signup successful:', userCredential.user); // Debug log
                
                // Add user data to Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: name,
                    email: email,
                    phone: phone,
                    createdAt: new Date().toISOString()
                });

                showAlert('success', 'Account created successfully!');
                document.getElementById('signupModal').style.display = 'none';
                signupForm.reset();
            } catch (error) {
                console.error('Signup error:', error); // Debug log
                showAlert('error', error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
}

// Auth State Observer
auth.onAuthStateChanged(user => {
    const authButtons = document.querySelector('.auth-buttons');
    if (user) {
        // User is signed in
        authButtons.innerHTML = `
            <button onclick="handleSignOut()" class="auth-btn">Sign Out</button>
        `;
    } else {
        // User is signed out
        authButtons.innerHTML = `
            <button id="loginBtn" class="auth-btn">Login</button>
            <button id="signupBtn" class="auth-btn">Sign Up</button>
        `;
        // Reinitialize buttons after DOM change
        loginBtn = document.getElementById('loginBtn');
        signupBtn = document.getElementById('signupBtn');
        setupEventListeners();
    }
});

// Sign Out Function
async function handleSignOut() {
    try {
        await auth.signOut();
        showAlert('success', 'Signed out successfully');
    } catch (error) {
        showAlert('error', 'Error signing out: ' + error.message);
    }
}

// Modal Control Functions
document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const showLoginBtn = document.getElementById('showLogin');
    const showSignupBtn = document.getElementById('showSignup');
    const switchToSignupLink = document.getElementById('switchToSignup');
    const switchToLoginLink = document.getElementById('switchToLogin');
    const closeBtns = document.getElementsByClassName('close-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Show login modal
    if (showLoginBtn) {
        showLoginBtn.onclick = function() {
            loginModal.style.display = "block";
        }
    }

    // Show signup modal
    if (showSignupBtn) {
        showSignupBtn.onclick = function() {
            signupModal.style.display = "block";
        }
    }

    // Switch to signup form
    if (switchToSignupLink) {
        switchToSignupLink.onclick = function(e) {
            e.preventDefault();
            loginModal.style.display = "none";
            signupModal.style.display = "block";
            loginForm.reset();
        }
    }

    // Switch to login form
    if (switchToLoginLink) {
        switchToLoginLink.onclick = function(e) {
            e.preventDefault();
            signupModal.style.display = "none";
            loginModal.style.display = "block";
            signupForm.reset();
        }
    }

    // Close modal functionality
    Array.from(closeBtns).forEach(btn => {
        btn.onclick = function() {
            loginModal.style.display = "none";
            signupModal.style.display = "none";
            loginForm.reset();
            signupForm.reset();
        }
    });

    // Close on outside click
    window.onclick = function(event) {
        if (event.target == loginModal || event.target == signupModal) {
            loginModal.style.display = "none";
            signupModal.style.display = "none";
            loginForm.reset();
            signupForm.reset();
        }
    }
});

// Add this after Firebase initialization
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        showAlert('success', 'Logged in as ' + user.email);
        
        // Update UI to show logged in state
        document.querySelectorAll('.auth-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Add a sign out button
        const authContainer = document.querySelector('.auth-container');
        const signOutBtn = document.createElement('button');
        signOutBtn.className = 'auth-btn';
        signOutBtn.textContent = 'Sign Out';
        signOutBtn.onclick = () => auth.signOut();
        authContainer.appendChild(signOutBtn);
    } else {
        // User is signed out
        console.log('User is signed out');
        
        // Reset UI to show login/signup buttons
        document.querySelectorAll('.auth-btn').forEach(btn => {
            btn.style.display = 'block';
        });
    }
});

// Add this function to handle sign out
async function handleSignOut() {
    try {
        await auth.signOut();
        showAlert('success', 'Signed out successfully');
    } catch (error) {
        showAlert('error', 'Error signing out: ' + error.message);
    }
}