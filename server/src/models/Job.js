import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    type: String,
    workMode: String,
    salary: Number,
    location: String,
    description: String,
    skills: [String],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;