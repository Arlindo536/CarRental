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
                // Use the auth module from config.js
                const userData = await auth.register(name, email, password);
                
                // Save user data and token to localStorage
                localStorage.setItem('userInfo', JSON.stringify(userData));
                localStorage.setItem('token', userData.token);
                
                // Show success message
                successAlert.textContent = 'Regjistrim i suksesshëm!';
                successAlert.style.display = 'block';
                
                // Redirect to profile page after delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
                
            } catch (error) {
                // Show error message
                errorAlert.textContent = error.message || 'Gabim gjatë regjistrimit';
                errorAlert.style.display = 'block';
            }
        });
    }
});