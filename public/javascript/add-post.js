// FILE DASHBOARD USES TO CREATE NEW POSTS

// NEW POST FORM HANDLER
async function newFormHandler(event) {
    event.preventDefault();

    // GET THE POST TITLE AND ARTICLE URL FROM THE FORM
    const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;

    // USE THE ADD A NEW POST POST ROUTE TO ADD THE POST 
    // USER ID IS ADDED FROM THE SESSION INFORMATION IN THE ROUTE
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // IF THE RESPONSE IS OKAY, RELOAD THE PAGE, SHOWING THE NEWEST POST NOW IN THE USER'S POST LIST
    if (response.ok) {
      document.location.replace('/dashboard');
      // OTHERWISE, DISPLAY THE ERROR
    } else {
      alert(response.statusText);
    }
  }

  // EVENT LISTENER FOR THE NEW POST SUBMIT BUTTON
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);