document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide any existing alerts
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                errorAlert.textContent = 'Fjalëkalimet nuk përputhen';
                errorAlert.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Gabim gjatë regjistrimit');
                }
                
                // Save user data and token to localStorage
                localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                
                // Show success message
                successAlert.textContent = 'Regjistrim i suksesshëm!';
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