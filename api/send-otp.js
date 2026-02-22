export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, phone, action } = req.body;

    // ===== GENERATE OTP =====
    if (action === 'generate') {
        if (!email || !phone) {
            return res.status(400).json({ error: 'Email and phone are required' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP in Firebase Realtime Database
        const FIREBASE_DB_URL = process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL;

        if (!FIREBASE_DB_URL) {
            console.error('Missing FIREBASE_DATABASE_URL');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        try {
            // Store OTP in Firebase (keyed by phone number - sanitized)
            const sanitizedPhone = phone.replace(/[^0-9]/g, '');
            const otpData = {
                otp: otp,
                email: email,
                phone: phone,
                expiresAt: expiresAt,
                verified: false,
                createdAt: new Date().toISOString()
            };

            const fbResponse = await fetch(
                `${FIREBASE_DB_URL}/otp_verifications/${sanitizedPhone}.json`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(otpData)
                }
            );

            if (!fbResponse.ok) {
                throw new Error('Failed to store OTP in database');
            }

            // Send OTP via email using Resend API
            const RESEND_API_KEY = process.env.RESEND_API_KEY;

            if (RESEND_API_KEY) {
                try {
                    const emailResponse = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${RESEND_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Fit Track Pro <onboarding@resend.dev>',
                            to: [email],
                            subject: `${otp} - Your Phone Verification Code | Fit Track Pro`,
                            html: `
                                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1a1a2e; color: #e0e0e0; border-radius: 16px;">
                                    <div style="text-align: center; margin-bottom: 24px;">
                                        <h1 style="color: #818cf8; margin: 0; font-size: 24px;">🏋️ Fit Track Pro</h1>
                                        <p style="color: #9ca3af; margin-top: 8px;">Phone Number Verification</p>
                                    </div>
                                    <div style="background: #16213e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                        <p style="color: #9ca3af; margin: 0 0 12px 0;">Your verification code is:</p>
                                        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #818cf8; background: rgba(99,102,241,0.1); padding: 16px; border-radius: 8px; border: 2px dashed #818cf8;">
                                            ${otp}
                                        </div>
                                        <p style="color: #6b7280; margin: 12px 0 0 0; font-size: 13px;">
                                            Verifying phone: <strong style="color: #e0e0e0;">+91 ${phone}</strong>
                                        </p>
                                    </div>
                                    <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
                                        ⏰ This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
                                    </p>
                                </div>
                            `
                        })
                    });

                    if (!emailResponse.ok) {
                        const errData = await emailResponse.json().catch(() => ({}));
                        console.error('Resend API Error:', errData);
                        // Still return success since OTP is stored - user can see it in email
                    }
                } catch (emailErr) {
                    console.error('Email send error:', emailErr);
                    // Non-fatal: OTP is still stored in DB
                }
            } else {
                console.warn('RESEND_API_KEY not set. OTP stored but email not sent.');
            }

            return res.status(200).json({
                success: true,
                message: 'OTP sent to your email',
                // In production, never send OTP in response. For demo/dev:
                ...(process.env.NODE_ENV !== 'production' ? { debug_otp: otp } : {})
            });

        } catch (error) {
            console.error('OTP Generation Error:', error);
            return res.status(500).json({ error: 'Failed to generate OTP' });
        }
    }

    // ===== VERIFY OTP =====
    if (action === 'verify') {
        const { phone: verifyPhone, otp: userOtp } = req.body;

        if (!verifyPhone || !userOtp) {
            return res.status(400).json({ error: 'Phone and OTP are required' });
        }

        const FIREBASE_DB_URL = process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL;

        if (!FIREBASE_DB_URL) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        try {
            const sanitizedPhone = verifyPhone.replace(/[^0-9]/g, '');

            // Fetch stored OTP
            const fbResponse = await fetch(
                `${FIREBASE_DB_URL}/otp_verifications/${sanitizedPhone}.json`
            );

            if (!fbResponse.ok) {
                return res.status(400).json({ error: 'No OTP found for this phone number' });
            }

            const otpData = await fbResponse.json();

            if (!otpData) {
                return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
            }

            // Check expiry
            if (Date.now() > otpData.expiresAt) {
                // Clean up expired OTP
                await fetch(`${FIREBASE_DB_URL}/otp_verifications/${sanitizedPhone}.json`, {
                    method: 'DELETE'
                });
                return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
            }

            // Check OTP match
            if (otpData.otp !== userOtp) {
                return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
            }

            // Mark as verified
            await fetch(`${FIREBASE_DB_URL}/otp_verifications/${sanitizedPhone}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verified: true, verifiedAt: new Date().toISOString() })
            });

            return res.status(200).json({ success: true, verified: true });

        } catch (error) {
            console.error('OTP Verify Error:', error);
            return res.status(500).json({ error: 'Failed to verify OTP' });
        }
    }

    return res.status(400).json({ error: 'Invalid action. Use "generate" or "verify".' });
}
