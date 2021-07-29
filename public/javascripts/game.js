document.addEventListener('DOMContentLoaded', async(event) => {

    const gameId = document.URL.split("/")[4]

    const reviews = await repopulateReviews(gameId)
    
    const userField = document.getElementById("fetchUserId")

    if (userField) {
        
        const userId = userField.value
        // Scalability issues, use fetch later
        const userReview = reviews.filter(review => review.User.id == userId)
        
        if (userReview.length) {
            renderUserReview(userReview[0].User.username, userReview[0].reviewScore, userReview[0].review, userId, gameId)
    
        } else {
            createReviewForm()
            await makeButtonPost(gameId, userId)
        }
    }
});

function createReviewForm (rating = 1) {
    const userReviewBox = document.getElementById("user-review-box")
    userReviewBox.innerHTML = `<h3 id="reviewHeader">Leave a Review!</h3>
      <select id="selectRating">
        <option hidden selected value="${rating}">${rating}</option>
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

// Renders reviews on page
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

// Displays user review instead of leave review form
function renderUserReview(username, reviewScore, review, userId, gameId) {
    
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

        createReviewForm(reviewScore)

        const textArea = document.getElementById("textReview")
        textArea.value = review

        const reviewHeader = document.getElementById("reviewHeader")
        reviewHeader.innerText = "Edit your review!"

        const cancelEditBtn = document.createElement("button")
        cancelEditBtn.innerText = "Cancel"
        userReviewBox.appendChild(cancelEditBtn)
        
        cancelEditBtn.addEventListener("click", async(e) => {
            e.preventDefault()
            
            renderUserReview(username, reviewScore, review, userId, gameId)
        })

        const submitEditBtn = document.getElementById("submitReview")
        submitEditBtn.innerText = "Submit Edit"

        submitEditBtn.addEventListener("click", async(e) => {
            const ratingValue = document.getElementById("selectRating").value
            const textReview = document.getElementById("textReview").value
            
            const reviewData = { userId, review:textReview, reviewScore: ratingValue, gameId }
            await fetch(`/games/${gameId}/review`, {
                method: "PUT",
                body: JSON.stringify(reviewData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            await repopulateReviews(gameId)
            
            renderUserReview(username, ratingValue, textReview, userId, gameId )
        })
    })

    const deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete"
    userReviewBox.appendChild(deleteButton)

    deleteButton.addEventListener("click", async (e) => {
        e.preventDefault()

        const reviewData = { userId, gameId }
        await fetch(`/games/${gameId}/review`, {
            method: "DELETE",
            body: JSON.stringify(reviewData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        createReviewForm()
        makeButtonPost(gameId, userId)
        repopulateReviews(gameId)
    })
}

async function makeButtonPost(gameId, userId) {
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
        
        renderUserReview(postReviewData.username, ratingValue, textReview, userId,  gameId)

        repopulateReviews(gameId)
    })
}
