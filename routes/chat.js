const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");
const Messages = require("../models/Messages");
const authenticateUser = require("../middleware/userdetails");


router.post("/get-user-chat-messages", authenticateUser, async (req, res) => {
  try {
    const messages = await Messages.findAll({
      where: {
        [Op.or]: [
          {
            from: req.user.id,
            to: req.body.to,
          },
          {
            from: req.body.to,
            to: req.user.id,
          },
        ],
      },
      order: [["sent_at", "ASC"]],
    });

    res.json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

module.exports = router;