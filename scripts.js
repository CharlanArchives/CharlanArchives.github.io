/* temporary login till backend is sorted out, just so i can fandagle and fiddle with the website */

function login(username, password) {
    if (username === "admin" && password === "password") {
        return true;
    }
    
    return false;
}

async function fetchTextFile(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

async function searchYearbook(query, year) {
    // Example usage:
    var text = await fetchTextFile('https://charlanarchives.github.io/archive/yearbooks/searchtext/' + year + '.pdf.txt');
    return text.toLowerCase().includes(query.toLowerCase());
}

const yearbookYears = [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function searchAllYearbooks(query) {
    const results = [];
    const promises = [];

    for (const year of yearbookYears) {
        const p = searchYearbook(query, year).then(val => {
            if (val === true) {
                results.push(year);
            }
        });
        promises.push(p);
    }

    return Promise.all(promises).then(() => results);
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
    
    const params = new URLSearchParams(window.location.search);
    var query = params.get("query");

    if (query) {
        console.log("making search req");
        var resultsGrid = document.getElementsByClassName("results-grid")[0];
        resultsGrid.innerHTML = "Loading...";
        document.getElementsByClassName("search-form")[0].getElementsByTagName("input")[0].value = query;
        
        searchAllYearbooks(query).then(yearbooks => {
            console.log(yearbooks)
        
        var iHTML = "";
        for (var i in yearbooks) {
            iHTML += `<div class="result-card">
            <a href="archive/yearbooks/${yearbooks[i]}.pdf" target="_blank" rel="noopener noreferrer">
                <img src="archive/yearbooks/thumbs/${yearbooks[i]}.jpg" alt="Yearbook ${yearbooks[i]} Cover">
                <h3>Yearbook ${yearbooks[i]}</h3>
                </a>
            </div>`;

            console.log(iHTML);
        }

        resultsGrid.innerHTML = iHTML;

        document.getElementsByClassName("summary-text")[0].innerHTML = "Showing <strong>" + yearbooks.length + "</strong> results for \"<strong>" + query + "</string>\".";
        });
        
    }

});
