# Good Gamez
![image](https://user-images.githubusercontent.com/83110040/127756956-489b6243-1ff0-40cc-a717-75d1fb831beb.png)

## Introduction

**Good Gamez** is a social cataloging websites that allows individuals to search its database of games and reviews. When searching for games, a user can use the genres tab to search for specific genres they are interested in. When a game that satifies their criteria is found, they can add it to a shelf which is either a default or user-made group that stores the games they are interested in.

[Visit GoodGamez here!](https://good-gamez.herokuapp.com/)

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies](#technologies)
3. [Documentation](#documentation)
4. [Development](#development)
5. [How To Use](#how-to-use)
6. [Code Highlights](#code-highlights)
7. [Future Plans](#future-plans)

## Technologies

* JavaScript
* HTML
* CSS
* Pug
* Express
* Sequelize
* PostgreSQL
* Heroku

## Documentation

* [Feature List](https://github.com/ShawnBoyle7/Programmatic/wiki/Feature-List)
* [Frontend Routes](https://github.com/Programmatic/Zoolodex/wiki/Frontend-Routes)
* [API Routes](https://github.com/ShawnBoyle7/Programmatic/wiki/API-Routes)
* [User Stories](https://github.com/ShawnBoyle7/Programmatic/wiki/User-Stories)
* [Database Schema](https://github.com/ShawnBoyle7/Programmatic/wiki/Database-Schema)

## Development

1. Clone the repository at https://github.com/penced0513/goodgamez <br></br>
2. Set up your local postgreSQL user and database. <br></br>
3. Create the .env file. You can use our env example as a reference, ensure your settings match your local database from last step. <br></br>
4. Change directory into the backend and frontend folders and run:  
```js
npm install  
```
```js
npm start
```

## How To Use

## Code Highlights
* This is a series of scripts to dynamically render a user's comments, the comment section, and average rating without refreshing.

```js
document.addEventListener('DOMContentLoaded', async (event) => {

    const gameId = document.URL.split("/")[4]

    const reviews = await repopulateReviews(gameId)

    const userField = document.getElementById("fetchUserId")

    if (userField) {

        const userId = userField.value
        const userReview = reviews.filter(review => review.User.id == userId)

        if (userReview.length) {
            renderUserReview(userReview[0].User.username, userReview[0].reviewScore, userReview[0].review, userId, gameId)

        } else {
            createReviewForm()
            await makeButtonPost(gameId, userId)
        }
    }
});

function createReviewForm(rating = 1) {
    const userReviewBox = document.getElementById("user-review-box")
    userReviewBox.innerHTML = `<h2 id="reviewHeader">Leave a Review!</h2>
    <select id="selectRating">
        <option hidden selected value="${rating}">${rating}</option>
        <option value="1">1 </option>
        <option value="2">2 </option>
        <option value="3">3 </option>
        <option value="4">4 </option>
        <option value="5">5 </option>
    </select>
    <div>
    <textarea style="resize:none" id="textReview" cols="30" rows="10" required></textarea>
    </div>
    <button id="submitReview">Post Review</button>
    </form>`
    userReviewBox.setAttribute("style", `
    grid-area: user-review;
    text-align: center;
    `)
    const reviewHeader = document.getElementById("reviewHeader")
    reviewHeader.setAttribute("style", `
    text-align: center;
    font-weight: bold;
    font-size: 1.7em;
    border-bottom: .05em solid #9146FF;
    color: #f0e6e6;
    margin-bottom: 0.5em;
    `)
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
        reviewContainer.setAttribute("style", "grid-area: no-reviews; text-align: center")
    }

    reviews.forEach(review => {
        const reviewContainer = document.createElement("div")

        const userAndRatingContainer = document.createElement("div")

        const userNameContainer = document.createElement("div")
        userNameContainer.innerText = review.User.username
        userAndRatingContainer.appendChild(userNameContainer)
        userNameContainer.setAttribute("style", "word-wrap: break-word; margin-right: 0.2em")

        const ratingValueContainer = document.createElement("div")
        ratingValueContainer.innerText = `Rating: ${review.reviewScore}`
        userAndRatingContainer.appendChild(ratingValueContainer)
        userAndRatingContainer.setAttribute("style", "grid-area: user-div")

        reviewContainer.appendChild(userAndRatingContainer)
        reviewContainer.setAttribute("style", 'display: grid; grid-template-areas: "user-div review"; grid-template-columns: 15% 85%; margin-bottom: 2em')

        const textReviewContainer = document.createElement("div")
        textReviewContainer.innerText = review.review
        reviewContainer.appendChild(textReviewContainer)
        textReviewContainer.setAttribute("style", "grid-area: review; word-wrap: break-word")
        reviewsContainer.appendChild(reviewContainer)
    })
    return reviews
}

function renderUserReview(username, reviewScore, review, userId, gameId) {

    const userReviewBox = document.getElementById("user-review-box")
    userReviewBox.innerHTML = ""

    const userNameContainer = document.createElement("h2")
    userNameContainer.innerText = "Your Review"
    userReviewBox.appendChild(userNameContainer)
    userNameContainer.setAttribute("style", `
    text-align: center;
    font-weight: bold;
    font-size: 1.7em;
    border-bottom: .05em solid #9146FF;;
    color: #f0e6e6;
    `)

    const ratingValueContainer = document.createElement("div")
    ratingValueContainer.innerText = `Rating: ${reviewScore}`
    ratingValueContainer.setAttribute("style", "margin-bottom: 1em; margin-top: 0.3em")
    userReviewBox.appendChild(ratingValueContainer)

    const textReviewContainer = document.createElement("div")
    textReviewContainer.innerText = review
    textReviewContainer.setAttribute("style", "word-wrap: break-word; text-align: left")
    userReviewBox.appendChild(textReviewContainer)

    const editButton = document.createElement("button")
    editButton.innerText = "Edit"
    userReviewBox.appendChild(editButton)



    editButton.addEventListener("click", async (e) => {
        e.preventDefault()

        createReviewForm(reviewScore)

        const textArea = document.getElementById("textReview")
        textArea.value = review

        const reviewHeader = document.getElementById("reviewHeader")
        reviewHeader.innerText = "Edit your review!"

        const cancelEditBtn = document.createElement("button")
        cancelEditBtn.innerText = "Cancel"
        userReviewBox.appendChild(cancelEditBtn)

        cancelEditBtn.addEventListener("click", async (e) => {
            e.preventDefault()

            renderUserReview(username, reviewScore, review, userId, gameId)
        })

        const submitEditBtn = document.getElementById("submitReview")
        submitEditBtn.innerText = "Submit Edit"

        submitEditBtn.addEventListener("click", async (e) => {
            const ratingValue = document.getElementById("selectRating").value
            const textReview = document.getElementById("textReview").value

            if (textReview && textReview !== "Please write a review") {
                if (textReview.length > 1000) {
                    alert("Review must be 1000 characters or less")
                } else {
                    const reviewData = { userId, review: textReview, reviewScore: ratingValue, gameId }
                    await fetch(`/games/${gameId}/review`, {
                        method: "PUT",
                        body: JSON.stringify(reviewData),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                    await repopulateReviews(gameId)

                    await renderUserReview(username, ratingValue, textReview, userId, gameId)
                }

            } else {
                const textReviewElement = document.getElementById("textReview")
                textReviewElement.value = "Please write a review"
                textReviewElement.style.border = "1px solid red"
            }
        })
    })

    const deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete"
    userReviewBox.appendChild(deleteButton)
    userReviewBox.setAttribute("style", `grid-area: user-review`)
    editButton.setAttribute("style", "margin-top: 10px")

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
        await makeButtonPost(gameId, userId)
        await repopulateReviews(gameId)
    })
}

async function makeButtonPost(gameId, userId) {
    const postReviewButton = document.getElementById("submitReview")
    postReviewButton.addEventListener("click", async (e) => {
        e.preventDefault()
        const ratingValue = document.getElementById("selectRating").value
        const textReview = document.getElementById("textReview").value

        if (textReview && textReview !== "Please write a review") {
            if (textReview.length > 1000) {
                alert("Review must be 1000 characters or less")
            } else {
                const reviewData = { userId, review: textReview, reviewScore: ratingValue, gameId }
                const postReviewFetch = await fetch(`/games/${gameId}/review`, {
                    method: "POST",
                    body: JSON.stringify(reviewData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const postReviewData = await postReviewFetch.json()

                renderUserReview(postReviewData.username, ratingValue, textReview, userId, gameId)

                repopulateReviews(gameId)
            }
        } else {
            const textReviewElement = document.getElementById("textReview")
            textReviewElement.value = "Please write a review"
            textReviewElement.style.border = "1px solid red"
        }
    })
}

```

## Future Plans

* We want to primarily finalize styling throughout our application

* In the future, we may implement Steam's API to autoseed games from their library.

## Authors Acknowledgement
* Daniel Pence - [Github](github.com/penced0513)
* Curtis Bridge - [Github](github.com/C-Bridge17)
* Shawn Boyle - [Github](github.com/ShawnBoyle7)
* Kristian Martinez - [Github](github.com/kristianmartinw)
