// A FUNCTION TO EDIT A POST
async function editFormHandler(event) {
    event.preventDefault();

    // GET THE POST ID FROM THE URL
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // GET THE POST TITLE FROM THE FORM
    const title = document.querySelector('input[name="post-title"]').value;

    // USE THE UPDATE ROUTE TO UPDATE THE POST
    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // IF THE EDIT ACTION IS SUCCESSFUL, REDIRECT TO THE DASHBOARD PAGE, OTHERWISE DISPLAY THE ERROR
    if (response.ok) {
        document.location.replace('/dashboard');
        // OTHERWISE, DISPLAY THE ERROR
    } else {
        alert(response.statusText);
    }

}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);