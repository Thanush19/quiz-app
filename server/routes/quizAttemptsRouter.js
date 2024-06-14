// quizAttemptsRouter.js

const express = require("express");
const router = express.Router();
const quizAttemptsController = require("../controllers/quizAttemptsController");

router.post("/", quizAttemptsController.createQuizAttempt);

router.get("/:userId", quizAttemptsController.getQuizAttemptsByUser);

module.exports = router;
