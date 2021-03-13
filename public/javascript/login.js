// SIGN UP FORM HANDLER
async function signupFormHandler(event) {
  event.preventDefault();

  // GET THE INFORMATION FROM THE SIGN UP FORM
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // IF ALL THREE FIELDS HAVE CONTENT
  if (username && email && password) {
    // POST THE NEW USER TO THE USER TABLE IN THE DATABASE
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    // WHEN THE FETCH PROMISE IS FUFILLED, CHECK THE RESPONSE STATUS AND CONVEY THE RESULTS
    if (response.ok) {
      console.log('success');
    } else {
      alert(response.statusText)
    }
  }
}

// LOGIN FORM HANDLER
async function loginFormHandler(event) {
  event.preventDefault();

  // GET THE INFORMATION FROM THE LOGIN FORM
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // IF BOTH FIELDS HAVE CONTENT
  if (email && password) {
    // POST TO THE LOGIN ROUTE WITH THE USER INFORMATION
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    // WHEN THE FETCH PROMISE IS FUFILLED, CHECK THE RESPONSE STATUS; IF THE RESPONSE IS GOOD, LOAD THE DASHBOARD; IF THERE IS AN ERROR, ALERT WITH THE STATUS
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText)
    }
  }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);