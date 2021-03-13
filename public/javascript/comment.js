// COMMENT FORM HANDLER
async function commentFormHandler(event) {
    event.preventDefault();

    // GET THE COMMENT TEXT FROM THE FORM
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // GET THE POST ID FROM THE URL, JUST AS FOR THE UPVOTE.JS FUNCTION
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // IF THERE IS COMMENT TEXT, SUBMIT THE COMMENT TO THE API ROUTE AND RELOAD THE PAGE TO SHOW THE COMMENT
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
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
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);