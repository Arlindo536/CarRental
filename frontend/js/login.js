document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide any existing alerts
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                // Use the auth module from config.js
                const userData = await auth.login(email, password);
                
                // Save user data and token to localStorage
                localStorage.setItem('userInfo', JSON.stringify(userData));
                localStorage.setItem('token', userData.token);
                
                // Show success message
                successAlert.textContent = 'Hyrje e suksesshme!';
                successAlert.style.display = 'block';
                
                // Redirect to profile page after delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
                
            } catch (error) {
                // Show error message
                errorAlert.textContent = error.message || 'Email ose fjalëkalim i pavlefshëm';
                errorAlert.style.display = 'block';
            }
        });
    }
});