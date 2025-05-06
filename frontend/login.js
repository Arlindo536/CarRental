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
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Gabim gjatë hyrjes');
                }
                
                // Save user data and token to localStorage
                localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                
                // Show success message
                successAlert.textContent = 'Hyrje e suksesshme!';
                successAlert.style.display = 'block';
                
                // Redirect to profile page after delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
                
            } catch (error) {
                // Show error message
                errorAlert.textContent = error.message;
                errorAlert.style.display = 'block';
            }
        });
    }
});