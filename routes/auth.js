const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const Users = require("../models/Users");
const cloud = require("../files/cloudinary");
const upload = require("../files/multer");
const authenticateUser = require("../middleware/userdetails");
const JWT_SECRET = "qwertyuiop";

router.post("/manager-signup", upload.array("image", 1), async (req, res) => {
  try {
    const existingUser = await Users.findOne({
      where: { email: req.body.email },
    });
    console.log(req.files);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "A user with this email already exists." }],
      });
    }
    // const uploadedImage = await cloud.uploader.upload(req.files[0].path);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await Users.create({
      name: req.body.name,
      email: req.body.email,
      phno: req.body.phno,
      //   profile_image: uploadedImage.secure_url,
      role: "manager",
      reporting_to: null,
      password: hashedPassword,
    });

    const data = {
      user: {
        id: newUser.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({
      success: true,
      authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post("/user-login", async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Invalid credentials. User not found." }],
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Invalid credentials. Incorrect password." }],
      });
    }

    // If the credentials are valid, create a JWT token
    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({
      success: true,
      authToken,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post(
  "/add-employee",
  authenticateUser,
  upload.array("image", 1),
  async (req, res) => {
    try {
      const existingUser = await Users.findOne({
        where: { email: req.body.email },
      });
      console.log(req.files);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          errors: [{ msg: "A user with this email already exists." }],
        });
      }
      const uploadedImage = await cloud.uploader.upload(req.files[0].path);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = await Users.create({
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno,
        profile_image: uploadedImage.secure_url,
        role: "employee",
        position: req.body.position,
        reporting_to: req.user.id,
        password: hashedPassword,
      });

      const data = {
        user: {
          id: newUser.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({
        success: true,
        authToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        errors: "Internal Server Error",
      });
    }
  }
);

router.get("/get-user", authenticateUser, async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.user.id },
    });

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.get("/get-manager", authenticateUser, async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.user.id },
    });

    const manager= await Users.findOne({
      where: { id: user.reporting_to },
    });

    res.json({
      success: true,
      manager: manager,
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
