// Authentication functions for login and registration

// Function to handle user registration
function registerUser(name, email, password) {
  return fetch('/api/auth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(data => {
              throw new Error(data.message || 'Gabim gjatë regjistrimit');
          });
      }
      return response.json();
  });
}

// Function to handle user login
function loginUser(email, password) {
  return fetch('/api/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(data => {
              throw new Error(data.message || 'Gabim gjatë hyrjes');
          });
      }
      return response.json();
  });
}

// Handle the register form submission
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
      const errorAlert = document.getElementById('errorAlert');
      const successAlert = document.getElementById('successAlert');
      
      registerForm.addEventListener('submit', function(e) {
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
          
          registerUser(name, email, password)
              .then(data => {
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
              })
              .catch(error => {
                  // Show error message
                  errorAlert.textContent = error.message;
                  errorAlert.style.display = 'block';
              });
      });
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      const errorAlert = document.getElementById('errorAlert');
      const successAlert = document.getElementById('successAlert');
      
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Hide any existing alerts
          errorAlert.style.display = 'none';
          successAlert.style.display = 'none';
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          loginUser(email, password)
              .then(data => {
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
              })
              .catch(error => {
                  // Show error message
                  errorAlert.textContent = error.message;
                  errorAlert.style.display = 'block';
              });
      });
  }
});