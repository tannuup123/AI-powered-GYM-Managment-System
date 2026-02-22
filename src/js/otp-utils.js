/**
 * OTP Verification Utility — Uses Firebase Realtime Database
 * No serverless function or external APIs needed!
 */
import { ref, set, get, remove } from 'firebase/database';
import { database } from '../config/firebase.js';

/**
 * Generate a 6-digit OTP, store it in Firebase DB
 * @param {string} phone - 10-digit phone number
 * @param {string} email - User's email (for reference)
 * @returns {{ success: boolean, otp: string }} - OTP for display
 */
export async function generateOTP(phone, email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sanitizedPhone = phone.replace(/[^0-9]/g, '');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const otpData = {
        otp: otp,
        email: email,
        phone: phone,
        expiresAt: expiresAt,
        verified: false,
        createdAt: new Date().toISOString()
    };

    await set(ref(database, `otp_verifications/${sanitizedPhone}`), otpData);

    return { success: true, otp: otp };
}

/**
 * Verify the OTP entered by the user
 * @param {string} phone - 10-digit phone number
 * @param {string} userOtp - OTP entered by user
 * @returns {{ success: boolean, error?: string }}
 */
export async function verifyOTP(phone, userOtp) {
    const sanitizedPhone = phone.replace(/[^0-9]/g, '');
    const snapshot = await get(ref(database, `otp_verifications/${sanitizedPhone}`));

    if (!snapshot.exists()) {
        return { success: false, error: 'No OTP found. Please request a new one.' };
    }

    const otpData = snapshot.val();

    // Check expiry
    if (Date.now() > otpData.expiresAt) {
        await remove(ref(database, `otp_verifications/${sanitizedPhone}`));
        return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    // Check match
    if (otpData.otp !== userOtp) {
        return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    // Mark verified & clean up
    await set(ref(database, `otp_verifications/${sanitizedPhone}/verified`), true);

    return { success: true };
}
