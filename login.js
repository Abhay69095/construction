import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
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

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user);
        showAlert('success', 'Logged in as ' + user.email);
        updateUIForLoggedInUser();
    } else {
        console.log('User is signed out');
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser() {
    document.querySelectorAll('.auth-btn').forEach(btn => {
        btn.style.display = 'none';
    });
    
    const authContainer = document.querySelector('.auth-container');
    if (!document.getElementById('signOutBtn')) {
        const signOutBtn = document.createElement('button');
        signOutBtn.id = 'signOutBtn';
        signOutBtn.className = 'auth-btn';
        signOutBtn.textContent = 'Sign Out';
        signOutBtn.onclick = handleSignOut;
        authContainer.appendChild(signOutBtn);
    }
}

function updateUIForLoggedOutUser() {
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.remove();
    
    document.querySelectorAll('.auth-btn').forEach(btn => {
        btn.style.display = 'block';
    });
}

async function handleSignOut() {
    try {
        await auth.signOut();
        showAlert('success', 'Signed out successfully');
    } catch (error) {
        showAlert('error', 'Error signing out: ' + error.message);
    }
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Initialize auth functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAuthButtons();
    setupAuthForms();
});

function setupAuthButtons() {
    // Setup login buttons
    document.querySelectorAll('#loginBtn, #showLogin').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'block';
        });
    });

    // Setup signup buttons
    document.querySelectorAll('#signupBtn, #showSignup').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('signupModal').style.display = 'block';
        });
    });

    // Setup modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Setup Google Sign In
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
}

function setupAuthForms() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;

    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showAlert('success', 'Logged in successfully!');
        document.getElementById('loginModal').style.display = 'none';
        this.reset();
    } catch (error) {
        showAlert('error', error.message);
    } finally {
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;

    try {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;
        const phone = document.getElementById('signupPhone').value;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            email,
            phone,
            createdAt: new Date().toISOString()
        });

        showAlert('success', 'Account created successfully!');
        document.getElementById('signupModal').style.display = 'none';
        this.reset();
    } catch (error) {
        showAlert('error', error.message);
    } finally {
        submitBtn.disabled = false;
    }
}

async function handleGoogleSignIn() {
    try {
        const result = await signInWithPopup(auth, provider);
        await setDoc(doc(db, 'users', result.user.uid), {
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            lastLogin: new Date().toISOString()
        }, { merge: true });

        showAlert('success', 'Signed in successfully with Google!');
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        showAlert('error', error.message);
    }
}

export { auth, db };
