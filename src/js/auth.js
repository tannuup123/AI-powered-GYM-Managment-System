// Authentication Utilities
import { auth, database } from '../config/firebase.js';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { ref, get, set, push } from 'firebase/database';
import { showToast } from '../components/toast.js';

/**
 * Sign in user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User credential
 */
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function logout() {
    try {
        await signOut(auth);
        localStorage.clear();
        showToast('Logged out successfully', 'success');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
    }
}

/**
 * Get user role from database
 * @param {string} uid - User ID
 * @returns {Promise<{role: string, data: Object}|null>}
 */
export async function getUserRole(uid) {
    const roles = ['members', 'trainers', 'owners'];

    for (const role of roles) {
        const snapshot = await get(ref(database, `${role}/${uid}`));
        if (snapshot.exists()) {
            return { role, data: snapshot.val() };
        }
    }
    return null;
}

/**
 * Redirect user to their dashboard based on role
 * @param {string} role 
 */
export function redirectToDashboard(role) {
    const dashboards = {
        members: '/member-dashboard.html',
        trainers: '/trainer-dashboard.html',
        owners: '/owner-dashboard.html'
    };

    const dashboard = dashboards[role];
    if (dashboard) {
        window.location.href = dashboard;
    } else {
        showToast('Unknown user role', 'error');
    }
}

/**
 * Check if user is authenticated, redirect to login if not
 * @param {Function} callback - Called with user object if authenticated
 */
export function requireAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            showToast('Please log in to continue', 'warning');
            window.location.href = '/login.html';
            return;
        }
        callback(user);
    });
}

/**
 * Register a new user
 * @param {string} email 
 * @param {string} password 
 * @param {string} role - 'members', 'trainers', or 'owners'
 * @param {Object} userData - Additional user data
 * @returns {Promise<Object>}
 */
export async function registerUser(email, password, role, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save user data to database
        await set(ref(database, `${role}/${uid}`), {
            ...userData,
            email,
            createdAt: new Date().toISOString()
        });

        return userCredential;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export { auth, database, onAuthStateChanged };
