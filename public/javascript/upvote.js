// A FUNCTION TO HANDLE THE UPVOTE BUTTON
async function upvoteClickHandler(event) {
    event.preventDefault();

    // GET THE POST ID FROM THE URL
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // ADD A VOTE TO THE POST WITH AN ASYNC FUNCTION
    // IF THE VOTE IS SUCCESSFUL, RELOAD THE PAGE, SHOWING THE NEW VOTE, OTHERWISE DISPLAY THE ERROR
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);