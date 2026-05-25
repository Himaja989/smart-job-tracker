import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import Job from "./models/Job.js";
import User from "./models/User.js";
import Application from "./models/Application.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.json({ message: "Hello from Job Tracker backend!" });
});

app.post("/api/signup", async (req, res) => {
  try {
   const name = req.body.name.trim();
const email = req.body.email.trim().toLowerCase();
const password = req.body.password.trim();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/signin", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
const password = req.body.password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/create-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({
      email: "admin@jobtracker.com",
    });

    if (existingAdmin) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@jobtracker.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Create admin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    const savedJob = await job.save();

    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Post job error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (err) {
    console.error("Update job error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Delete job error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const application = new Application(req.body);
    const savedApplication = await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: savedApplication,
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.applicantEmail,
        subject: "Application Submitted Successfully",
        html: `
          <h2>Application Received</h2>

          <p>Hello ${req.body.applicantName},</p>

          <p>
            Your application for
            <strong>${req.body.jobTitle}</strong>
            at
            <strong>${req.body.company}</strong>
            has been submitted successfully.
          </p>

          <p>
            Our recruitment team will review your application
            and contact you by email regarding the next steps.
          </p>

          <br/>

          <p>Smart Job Tracker Team</p>
        `,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New Job Application Received",
        html: `
          <h2>New Application Received</h2>

          <p><strong>Name:</strong> ${req.body.applicantName}</p>
          <p><strong>Email:</strong> ${req.body.applicantEmail}</p>
          <p><strong>Phone:</strong> ${req.body.applicantPhone}</p>
          <p><strong>Job Title:</strong> ${req.body.jobTitle}</p>
          <p><strong>Company:</strong> ${req.body.company}</p>
          <p><strong>Resume:</strong> ${req.body.applicantResume}</p>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }
  } catch (err) {
    console.error("Application save error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Fetch applications error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/applications/:id/status", async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updatedApplication);
  } catch (err) {
    console.error("Status update error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});