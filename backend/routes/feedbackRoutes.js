import express from "express";
import Feedback from '../models/feedback.js';
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        message: "Name, rating and comment are required"
      });
    }

    const feedback = new Feedback({
      name,
      rating,
      comment
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback saved successfully",
      feedback
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save feedback",
      error: error.message
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({
      createdAt: -1
    });

    res.status(200).json(feedback);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        name,
        rating,
        comment
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update feedback",
      error: error.message
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFeedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      message: "Feedback deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete feedback",
      error: error.message
    });
  }
});


export default router;