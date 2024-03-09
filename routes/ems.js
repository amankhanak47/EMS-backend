const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const cloud = require("../files/cloudinary");
const upload = require("../files/multer");
const authenticateUser = require("../middleware/userdetails");
const Tasks = require("../models/Tasks");
const Leaves = require("../models/Leave");
const { Op } = require("sequelize");

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

router.post("/assign-task", authenticateUser, async (req, res) => {
  try {
    const task = await Tasks.create({
      subject: req.body.subject,
      description: req.body.description,
      deadline: req.body.deadline,
      status: "pending",
      assign_to: req.body.assign_to,
      assign_by: req.user.id,
    });

    res.json({
      success: true,
      task: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.get("/get-task-status", authenticateUser, async (req, res) => {
  try {
    const tasks = await Tasks.findAll({
      include: [{ model: Users, as: "assignTo" }],
      where: {
        assign_by: req.user.id,
        status: "completed",
      },
    });

    res.json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.get("/get-assigned-task", authenticateUser, async (req, res) => {
  try {
    const tasks = await Tasks.findAll({
      where: {
        assign_to: req.user.id,
        status: "pending",
      },
    });

    res.json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post("/submit-task", authenticateUser, async (req, res) => {
  try {
    const task = await Tasks.update(
      {
        status: "completed",
      },
      {
        where: {
          assign_to: req.user.id,
          id: req.body.task_id,
        },
      }
    );

    res.json({
      success: true,
      task: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post("/request-leave", authenticateUser, async (req, res) => {
  try {
    const leave = await Leaves.create({
      type: req.body.type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      reason: req.body.reason,
      status: "pending",
      requested_by: req.user.id,
      requested_to: req.body.requested_to,
    });

    res.json({
      success: true,
      leave: leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.get("/get-all-leaves", authenticateUser, async (req, res) => {
  try {
    const leaves = await Leaves.findAll({
      include: [{ model: Users, as: "requestedBy" }],
      where: {
        requested_to: req.user.id,
        status: "pending",
      },
    });

    res.json({
      success: true,
      leaves: leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.get("/get-leaves-status", authenticateUser, async (req, res) => {
  try {
    const leaves = await Leaves.findAll({
      where: {
        requested_by: req.user.id,
        status: {
          [Op.ne]: "pending",
        },
      },
    });

    res.json({
      success: true,
      leaves: leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post("/approve-leave", authenticateUser, async (req, res) => {
  try {
    const leave = await Leaves.update(
      {
        status: "accepted",
      },
      {
        where: {
          requested_to: req.user.id,
          id: req.body.leave_id,
        },
      }
    );

    res.json({
      success: true,
      leave: leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

router.post("/reject-leave", authenticateUser, async (req, res) => {
  try {
    const leave = await Leaves.update(
      {
        status: "rejected",
      },
      {
        where: {
          requested_to: req.user.id,
          id: req.body.leave_id,
        },
      }
    );

    res.json({
      success: true,
      leave: leave,
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
