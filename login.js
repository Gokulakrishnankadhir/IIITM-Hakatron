document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const signUpLink = document.getElementById('signUp');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Here you would typically send the login data to your server
        console.log('Login attempt:', { email, password });

        // For demonstration purposes, we'll just log a success message
        alert('Login successful!');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Here you would typically redirect to a password reset page
        console.log('Forgot password clicked');
        alert('Forgot password functionality not implemented in this demo.');
    });

    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Here you would typically redirect to a sign up page
        console.log('Sign up clicked');
        alert('Sign up functionality not implemented in this demo.');
    });
});