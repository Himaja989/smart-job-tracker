import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobTitle: String,
    company: String,
    location: String,
    workMode: String,
    salary: Number,
    description: String,

    status: {
      type: String,
      default: "Applied",
    },

    applicantName: String,
    applicantEmail: String,
    applicantPhone: String,
    applicantGender: String,
    applicantEducation: String,
    applicantUniversity: String,
    applicantGraduationYear: String,
    applicantResume: String,

    experience: String,
    expectedSalary: String,
    availability: String,
    coverLetter: String,
    appliedDate: String,
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;