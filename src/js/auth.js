/**
 * Authentication Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            // Mock login logic
            console.log('Logging in...', email);
            if (email.includes('admin')) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'user/dashboard.html';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Signing up...');
            window.location.href = 'user/dashboard.html';
        });
    }
});
