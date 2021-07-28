document.addEventListener('DOMContentLoaded', (event) => {
    
    const postReviewButton = document.getElementById("submitReview")
    const gameId = document.getElementById("fetchGameId").value
    const reviews = await fetch(`/games/${gameId}/reviews`)
    console.log(gameId)
    if(postReviewButton){
        postReviewButton.addEventListener("click", (e) => {
            e.preventDefault()
            
        })
    }
});
