/* temporary login till backend is sorted out, just so i can fandagle and fiddle with the website */

function login(username, password) {
    if (username === "admin" && password === "password") {
        return true;
    }
    
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    const authLink = document.getElementById('auth-link');
    const adminLink = document.getElementById('admin-link');
    
    function updateAuthUI() {
        const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';

        if (isUserLoggedIn) {
            if (adminLink) {
                adminLink.style.display = 'inline'; 
            }
            if (authLink) {
                authLink.textContent = 'SIGN OUT';
                authLink.href = '#logout'; 
                authLink.removeEventListener('click', handleLogout); 
                authLink.addEventListener('click', handleLogout);   
            }
        } else {
            if (adminLink) {
                adminLink.style.display = 'none';
            }
            if (authLink) {
                authLink.textContent = 'SIGN IN';
                authLink.href = 'login.html';
                authLink.removeEventListener('click', handleLogout); 
            }
        }
    }

    function handleLogout(event) {
        event.preventDefault();
        localStorage.removeItem('isUserLoggedIn');
        alert('You have been signed out.');
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('login-form');
    const loginErrorMessage = document.getElementById('login-error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput.value.trim();
            const password = passwordInput.value; 

            if (loginErrorMessage) loginErrorMessage.textContent = '';

            // username 'admin', password 'password'
            if (login(username, password)) {
                localStorage.setItem('isUserLoggedIn', 'true');
                alert('Login successful! Redirecting...');
                window.location.href = 'index.html'; 
            } else {
                localStorage.removeItem('isUserLoggedIn'); 
                if (loginErrorMessage) {
                    loginErrorMessage.textContent = 'Invalid username or password. Please try again.';
                } else {
                    alert('Invalid username or password.');
                }
                if (passwordInput) passwordInput.value = '';
            }
        });
    }

    if (authLink || adminLink) {
        updateAuthUI();
    }

});
