const API_URL = "https://feedback-manager-1-4pvz.onrender.com";

const form = document.getElementById("feedback-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();

  const feedbackData = {
    name,
    rating: Number(rating),
    comment
  };

  try {
    const response = await fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(feedbackData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to submit feedback"
      );
    }

    message.textContent = data.message;

    form.reset();

  } catch (error) {
    console.error("Error:", error);

    message.textContent =
      error.message || "Something went wrong";
  }
});