// A FUNCTION TO DELETE A POST
async function deleteFormHandler(event) {
    event.preventDefault();

    // GET THE POST ID FROM THE URL
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // DELETE THE POST WITH AN ASYNC FUNCTION
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });
    // IF THE DELETE ACTION IS SUCCESSFUL, REDIRECT TO THE DASHBOARD PAGE, OTHERWISE DISPLAY THE ERROR
    if (response.ok) {
        document.location.replace('/dashboard');
        // OTHERWISE, DISPLAY THE ERROR
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);