document.addEventListener('DOMContentLoaded', async(event) => {
    
    const userId = document.getElementById("fetchUserId").value
    const gameId = document.getElementById("fetchGameId").value

    const reviewsFetch = await fetch(`/games/${gameId}/reviews`)
    const reviewsData = await reviewsFetch.json()
    const reviews = reviewsData.reviews

    const reviewsContainer = document.getElementById("reviews-container")
    if (reviews.length) {
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
    }

    const userReview = reviews.filter(review => {
        return review.User.id == userId
    })

    if (userReview.length) {
 
        
        const userReviewBox = document.getElementById("user-review-box")

        const reviewContainer = document.createElement("div")

        const userNameContainer = document.createElement("div")
        userNameContainer.innerText = userReview[0].User.username
        reviewContainer.appendChild(userNameContainer)

        const ratingValueContainer = document.createElement("div")
        ratingValueContainer.innerText = userReview[0].reviewScore
        reviewContainer.appendChild(ratingValueContainer)

        const textReviewContainer = document.createElement("div")
        textReviewContainer.innerText = userReview[0].review
        reviewContainer.appendChild(textReviewContainer)

        userReviewBox.innerHTML = reviewContainer.innerHTML


        // const editButton = document.createElement("button")
        // editButton.innerText = "Edit"
        // userReviewBox.appendChild(editButton)

        // editButton.addEventListener("click", async(e) => {
        //     e.preventDefault()
        //     const userReviewBox = document.getElementById("user-review-box")
        //     userReviewBox.innerHTML = `<h3>Leave a Review!</h3>
        //       <select id="selectRating" > 
        //         <option value="${userReview[0].reviewScore}" selected hidden>${userReview[0].reviewScore}</option>
        //         <option value="1">1 </option>
        //         <option value="2">2 </option>
        //         <option value="3">3 </option>
        //         <option value="4">4 </option>
        //         <option value="5">5 </option>
        //       </select>
        //       <div>  
        //         <textarea id="textReview" cols="30" rows="10"> </textarea>
        //       </div>
        //       <button id="submitEdit">Edit Review</button>
        //     </form>`

        //     const ratingValue = document.getElementById("selectRating").value
        //     const textReview = document.getElementById("textReview").value

        //     const reviewData = { userId, review:textReview, reviewScore: ratingValue, gameId }
        //     const editReviewFetch = await fetch(`/games/${gameId}/review`, {
        //         method: "PUT",
        //         body: JSON.stringify(reviewData),
        //         headers: {
        //           "Content-Type": "application/json"
        //         }
        //     })

        //     const postReviewData = await editReviewFetch.json()
            
        //     const reviewContainer = document.createElement("div")

        //     const userNameContainer = document.createElement("h3")
        //     userNameContainer.innerText = postReviewData.username
        //     reviewContainer.appendChild(userNameContainer)

        //     const ratingValueContainer = document.createElement("div")
        //     ratingValueContainer.innerText = ratingValue
        //     reviewContainer.appendChild(ratingValueContainer)

        //     const textReviewContainer = document.createElement("div")
        //     textReviewContainer.innerText = textReview
        //     reviewContainer.appendChild(textReviewContainer)

        //     userReviewBox.innerHTML = reviewContainer.innerHTML

        //     const reviewsFetch = await fetch(`/games/${gameId}/reviews`)
        //     const reviewsData = await reviewsFetch.json()
        //     const reviews = reviewsData.reviews
        
        //     const reviewsContainer = document.getElementById("reviews-container")
        //     if (reviews.length) {
        //         reviews.forEach(review => {
        //             const reviewContainer = document.createElement("div")
        
        //             const userNameContainer = document.createElement("div")
        //             userNameContainer.innerText = review.User.username
        //             reviewContainer.appendChild(userNameContainer)
        
        //             const ratingValueContainer = document.createElement("div")
        //             ratingValueContainer.innerText = review.reviewScore
        //             reviewContainer.appendChild(ratingValueContainer)
        
        //             const textReviewContainer = document.createElement("div")
        //             textReviewContainer.innerText = review.review
        //             reviewContainer.appendChild(textReviewContainer)
        
        //             reviewsContainer.appendChild(reviewContainer)
        //         })
        //     }
        // })

        

    } else {
        // display text area, review score, and submit button for review
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
            
            const reviewContainer = document.createElement("div")

            const userNameContainer = document.createElement("h3")
            userNameContainer.innerText = postReviewData.username
            reviewContainer.appendChild(userNameContainer)

            const ratingValueContainer = document.createElement("div")
            ratingValueContainer.innerText = ratingValue
            reviewContainer.appendChild(ratingValueContainer)

            const textReviewContainer = document.createElement("div")
            textReviewContainer.innerText = textReview
            reviewContainer.appendChild(textReviewContainer)

            reviewsContainer.appendChild(reviewContainer)

            userReviewBox.innerHTML = reviewContainer.innerHTML
        })
        
    }

});