const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const cloud = require("../files/cloudinary");
const upload = require("../files/multer");
const authenticateUser = require("../middleware/userdetails");

router.get("/get-all-employee", authenticateUser, async (req, res) => {
  try {
    const allMentees = await Users.findAll({
      where: { reporting_to: req.user.id },
    });

    
    res.json({
      success: true,
      mentees: allMentees,
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
