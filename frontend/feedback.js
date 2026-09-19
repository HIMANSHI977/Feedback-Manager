const API_URL = "http://localhost:3005";

const feedbackList =
  document.getElementById("feedback-list");

const feedbackMessage =
  document.getElementById("feedback-message");

const editSection =
  document.getElementById("edit-section");

const editForm =
  document.getElementById("edit-form");

const editId =
  document.getElementById("edit-id");

const editName =
  document.getElementById("edit-name");

const editRating =
  document.getElementById("edit-rating");

const editComment =
  document.getElementById("edit-comment");

const closeEditButton =
  document.getElementById("closeEditButton");

const cancelEditButton =
  document.getElementById("cancelEditButton");


async function getFeedback() {
  try {
    feedbackList.innerHTML = `
      <p class="loading">
        Loading feedback...
      </p>
    `;

    const response =
      await fetch(`${API_URL}/api/feedback`);

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Failed to load feedback"
      );
    }

    displayFeedback(data);

  } catch (error) {
    console.error(
      "Error loading feedback:",
      error
    );

    feedbackList.innerHTML = `
      <div class="error-state">
        <h3>
          Unable to load feedback
        </h3>

        <p>
          Please check your server and try again.
        </p>

        <button
          id="retryButton"
          class="retry-button"
        >
          Try Again
        </button>
      </div>
    `;

    document
      .getElementById("retryButton")
      .addEventListener(
        "click",
        getFeedback
      );
  }
}


function displayFeedback(feedback) {

  feedbackList.innerHTML = "";

  if (feedback.length === 0) {

    feedbackList.innerHTML = `
      <div class="empty-state">

        <h3>
          No feedback yet
        </h3>

        <p>
          Be the first one to submit feedback.
        </p>

      </div>
    `;

    return;
  }


  feedback.forEach((item) => {

    const card =
      document.createElement("div");

    card.className = "feedback-card";

    const header =
      document.createElement("div");

    header.className = "feedback-header";


    const studentInfo =
      document.createElement("div");

    studentInfo.className =
      "student-info";


    const name =
      document.createElement("h3");

    name.textContent =
      item.name;


    const date =
      document.createElement("p");

    date.textContent =
      formatDate(item.createdAt);


    studentInfo.appendChild(name);
    studentInfo.appendChild(date);


    const rating =
      document.createElement("div");

    rating.className =
      "rating";


    const stars =
      document.createElement("span");

    stars.className =
      "stars";

    stars.textContent =
      createStars(item.rating);


    const ratingNumber =
      document.createElement("span");

    ratingNumber.className =
      "rating-number";

    ratingNumber.textContent =
      `${item.rating}/5`;


    rating.appendChild(stars);
    rating.appendChild(ratingNumber);


    header.appendChild(studentInfo);
    header.appendChild(rating);


    const comment =
      document.createElement("p");

    comment.className =
      "feedback-comment";

    comment.textContent =
      item.comment;


    const actions =
      document.createElement("div");

    actions.className =
      "feedback-actions";


    const editButton =
      document.createElement("button");

    editButton.className =
      "edit-button";

    editButton.textContent =
      "Edit";

    editButton.addEventListener(
      "click",
      () => openEditForm(item)
    );


    const deleteButton =
      document.createElement("button");

    deleteButton.className =
      "delete-button";

    deleteButton.textContent =
      "Delete";

    deleteButton.addEventListener(
      "click",
      () => deleteFeedback(item._id)
    );


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(header);
    card.appendChild(comment);
    card.appendChild(actions);

    feedbackList.appendChild(card);
  });
}


function createStars(rating) {

  let stars = "";

  for (let i = 1; i <= 5; i++) {

    if (i <= rating) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }

  return stars;
}


function formatDate(date) {

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}


function openEditForm(item) {

  editId.value =
    item._id;

  editName.value =
    item.name;

  editRating.value =
    item.rating;

  editComment.value =
    item.comment;

  editSection.classList.remove(
    "hidden"
  );

  editSection.scrollIntoView({
    behavior: "smooth"
  });
}


function closeEditForm() {

  editSection.classList.add(
    "hidden"
  );

  editForm.reset();
}


editForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const id =
      editId.value;

    const updatedData = {
      name: editName.value,
      rating: editRating.value,
      comment: editComment.value
    };


    try {

      const response =
        await fetch(
          `${API_URL}/api/feedback/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(updatedData)
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update feedback"
        );
      }


      feedbackMessage.textContent =
        "Feedback updated successfully";

      feedbackMessage.className =
        "success-message";


      closeEditForm();

      await getFeedback();


    } catch (error) {

      console.error(
        "Error updating feedback:",
        error
      );

      feedbackMessage.textContent =
        error.message ||
        "Failed to update feedback";

      feedbackMessage.className =
        "error-message";
    }
  }
);


async function deleteFeedback(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this feedback?"
    );

  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/feedback/${id}`,
        {
          method: "DELETE"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to delete feedback"
      );
    }


    feedbackMessage.textContent =
      "Feedback deleted successfully";

    feedbackMessage.className =
      "success-message";


    await getFeedback();


  } catch (error) {

    console.error(
      "Error deleting feedback:",
      error
    );

    feedbackMessage.textContent =
      error.message ||
      "Failed to delete feedback";

    feedbackMessage.className =
      "error-message";
  }
}


closeEditButton.addEventListener(
  "click",
  closeEditForm
);

cancelEditButton.addEventListener(
  "click",
  closeEditForm
);


getFeedback();