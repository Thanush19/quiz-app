const db = require("../db/db");

// POST a new quiz attempt
const createQuizAttempt = async (req, res) => {
  try {
    const {
      quiz_name,
      user_id,
      already_attended,
      correctly_answered,
      wrong_answered,
      average_time_taken,
      total_questions,
    } = req.body;

    const newQuizAttempt = await db.query(
      "INSERT INTO quiz_attempts (quiz_name, user_id, already_attended, correctly_answered, wrong_answered, average_time_taken, total_questions) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        quiz_name,
        user_id,
        already_attended,
        correctly_answered,
        wrong_answered,
        average_time_taken,
        total_questions,
      ]
    );

    res.status(201).json(newQuizAttempt.rows[0]);
  } catch (error) {
    console.error("Error creating quiz attempt:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// GET all quiz attempts for a specific user
const getQuizAttemptsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userQuizAttempts = await db.query(
      "SELECT * FROM quiz_attempts WHERE user_id = $1",
      [userId]
    );

    res.json(userQuizAttempts.rows);
  } catch (error) {
    console.error("Error fetching quiz attempts:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createQuizAttempt,
  getQuizAttemptsByUser,
};
