document.addEventListener('DOMContentLoaded', async(event) => {

    const gameId = document.URL.split("/")[4]

    const reviews = await repopulateReviews(gameId)
    
    const userField = document.getElementById("fetchUserId")

    if (userField){
        
        const userId = userField.value
        const userReview = reviews.filter(review => review.User.id == userId)
        
        if (userReview.length) {
        
            renderReview(userReview[0].User.username, userReview[0].reviewScore, userReview[0].review, userId, gameId)
    
        } else {
           
            createReviewForm()
    
            const postReviewButton = document.getElementById("submitReview")
            postReviewButton.addEventListener("click", async(e) => {
                e.preventDefault()
                const ratingValue = document.getElementById("selectRating").value
                const textReview = document.getElementById("textReview").value
    
                const reviewData = { userId, review:textReview, reviewScore: ratingValue, gameId }
                const postReviewFetch = await fetch(`/games/${gameId}/review`, {
                    method: "POST",
                    body: JSON.stringify(reviewData),
                    headers: {
                      "Content-Type": "application/json"
                    }
                })
    
                const postReviewData = await postReviewFetch.json()
                
                renderReview(postReviewData.username, ratingValue, textReview, userId,  gameId)
            })
        }
    }
});

function createReviewForm () {
    const userReviewBox = document.getElementById("user-review-box")
    userReviewBox.innerHTML = `<h3>Leave a Review!</h3>
      <select id="selectRating" > 
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
        <option value="5">5 </option>
      </select>
      <div>  
        <textarea id="textReview" cols="30" rows="10"> </textarea>
      </div>
      <button id="submitReview">Post Review</button>
    </form>`
}

async function repopulateReviews(gameId) {

    const reviewsFetch = await fetch(`/games/${gameId}/reviews`)
    const reviewsData = await reviewsFetch.json()
    const reviews = reviewsData.reviews

    const reviewsContainer = document.getElementById("reviews-container")
    reviewsContainer.innerHTML = ""
        if (!reviews.length) {
            const reviewContainer = document.createElement("div")

            const textReviewContainer = document.createElement("div")
            textReviewContainer.innerText = "No reviews yet!"
            reviewContainer.appendChild(textReviewContainer)

            reviewsContainer.appendChild(reviewContainer)
        } 

        reviews.forEach(review => {
            const reviewContainer = document.createElement("div")

            const userNameContainer = document.createElement("div")
            userNameContainer.innerText = review.User.username
            reviewContainer.appendChild(userNameContainer)

            const ratingValueContainer = document.createElement("div")
            ratingValueContainer.innerText = review.reviewScore
            reviewContainer.appendChild(ratingValueContainer)

            const textReviewContainer = document.createElement("div")
            textReviewContainer.innerText = review.review
            reviewContainer.appendChild(textReviewContainer)

            reviewsContainer.appendChild(reviewContainer)
        })
        return reviews
}

function renderReview(username, reviewScore, review, userId, gameId) {
    
    const userReviewBox = document.getElementById("user-review-box")
    userReviewBox.innerHTML = ""

    const userNameContainer = document.createElement("div")
    userNameContainer.innerText = username
    userReviewBox.appendChild(userNameContainer)

    const ratingValueContainer = document.createElement("div")
    ratingValueContainer.innerText = reviewScore
    userReviewBox.appendChild(ratingValueContainer)

    const textReviewContainer = document.createElement("div")
    textReviewContainer.innerText = review
    userReviewBox.appendChild(textReviewContainer)

    const editButton = document.createElement("button")
    editButton.innerText = "Edit"
    userReviewBox.appendChild(editButton)

    editButton.addEventListener("click", async(e) => {
        e.preventDefault()

        createReviewForm()

        const submitEdit = document.getElementById("submitReview")
        submitEdit.addEventListener("click", async(e) => {
            const ratingValue = document.getElementById("selectRating").value
            const textReview = document.getElementById("textReview").value

            const reviewData = { userId, review:textReview, reviewScore: ratingValue, gameId }
            const editReviewFetch = await fetch(`/games/${gameId}/review`, {
                method: "PUT",
                body: JSON.stringify(reviewData),
                headers: {
                  "Content-Type": "application/json"
                }
            })

            await repopulateReviews(gameId)
            
            const postReviewData = await editReviewFetch.json()
            renderReview(postReviewData.username, ratingValue, textReview, userId, gameId )
        })
    })
}
