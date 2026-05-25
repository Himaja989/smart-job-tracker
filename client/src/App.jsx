import { useEffect, useState } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Building2,
  User,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  FileText,
  UserCircle,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function App() {
  const [authMode, setAuthMode] = useState("signup");
  const [page, setPage] = useState("auth");
  const [account, setAccount] = useState(null);

  const [selectedType, setSelectedType] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [salaryRange, setSalaryRange] = useState("All");
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedAppliedJob, setSelectedAppliedJob] = useState(null);
  const [adminApplications, setAdminApplications] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);

  useEffect(() => {
    const savedAccount = localStorage.getItem("account");

    if (savedAccount) {
      const parsedAccount = JSON.parse(savedAccount);
      setAccount(parsedAccount);

      if (parsedAccount.role === "admin") {
        setPage("admin");
        fetchApplications();
      } else {
        setPage("dashboard");

        const savedAppliedJobs = localStorage.getItem(
          `appliedJobs_${parsedAccount.email}`
        );

        if (savedAppliedJobs) {
          setAppliedJobs(JSON.parse(savedAppliedJobs));
        }
      }
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    if (account?.email) {
      localStorage.setItem(
        `appliedJobs_${account.email}`,
        JSON.stringify(appliedJobs)
      );
    }
  }, [appliedJobs, account]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Jobs fetch error:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications`);
      const data = await res.json();
      setAdminApplications(data);
    } catch (err) {
      console.error("Applications fetch error:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const newAccount = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const res = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Account created successfully. Please sign in.");
    setAuthMode("signin");
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const response = await fetch(`${API_URL}/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setAccount(data.user);
    localStorage.setItem("account", JSON.stringify(data.user));

    if (data.user.role === "admin") {
      await fetchApplications();
      setPage("admin");
    } else {
      const savedAppliedJobs = localStorage.getItem(
        `appliedJobs_${data.user.email}`
      );

      if (savedAppliedJobs) {
        setAppliedJobs(JSON.parse(savedAppliedJobs));
      }

      setPage("dashboard");
    }
  };

  const confirmLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;

    localStorage.removeItem("account");
    setPage("auth");
    setAuthMode("signin");
    setAccount(null);
    setSelectedJob(null);
    setSelectedAppliedJob(null);
    setShowProfile(false);
    setShowPostJob(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const updatedAccount = {
      ...account,
      name: e.target.name.value,
      email: e.target.email.value,
    };

    setAccount(updatedAccount);
    localStorage.setItem("account", JSON.stringify(updatedAccount));
    setShowProfile(false);
    alert("Profile updated successfully.");
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    const newJob = {
      title: e.target.title.value,
      company: e.target.company.value,
      type: e.target.type.value,
      workMode: e.target.workMode.value,
      salary: Number(e.target.salary.value),
      location: e.target.location.value,
      description: e.target.description.value,
      skills: e.target.skills.value.split(",").map((skill) => skill.trim()),
    };

    const res = await fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    const savedJob = await res.json();

    if (!res.ok) {
      alert("Failed to post job.");
      return;
    }

    setJobs((prev) => [savedJob, ...prev]);
    setShowPostJob(false);
    alert("Job posted successfully.");
  };

  const deleteJob = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete job.");
      return;
    }

    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    const applicationDetails = {
      jobId: selectedJob._id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      location: selectedJob.location,
      workMode: selectedJob.workMode,
      salary: selectedJob.salary,
      description: selectedJob.description,

      applicantName: e.target.fullName.value,
      applicantEmail: e.target.email.value,
      applicantPhone: e.target.phone.value,
      applicantGender: e.target.gender.value,
      applicantEducation: e.target.education.value,
      applicantUniversity: e.target.university.value,
      applicantGraduationYear: e.target.graduationYear.value,
      applicantResume: e.target.resume.value,

      experience: e.target.experience.value,
      expectedSalary: e.target.expectedSalary.value,
      availability: e.target.availability.value,
      coverLetter: e.target.coverLetter.value,
      appliedDate: new Date().toLocaleDateString(),
    };

    const res = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationDetails),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setAppliedJobs((prev) => [...prev, applicationDetails]);
    setSelectedJob(null);
    alert("Application submitted successfully. Confirmation email sent.");
  };

  const filteredJobs = jobs.filter((job) => {
    const isApplied = appliedJobs.some((applied) => applied.jobId === job._id);

const keyword = search.toLowerCase();
const locationKeyword = locationSearch.toLowerCase();

const matchesSearch =
  job.title?.toLowerCase().includes(keyword) ||
  job.company?.toLowerCase().includes(keyword) ||
  job.type?.toLowerCase().includes(keyword) ||
  job.description?.toLowerCase().includes(keyword) ||
  job.skills?.join(" ").toLowerCase().includes(keyword);

const matchesLocation =
  locationKeyword === "" ||
  job.location?.toLowerCase().includes(locationKeyword) ||
  job.workMode?.toLowerCase().includes(locationKeyword);

const matchesType =
  selectedType === "All" || job.type === selectedType;

const matchesMode =
  selectedMode === "All" || job.workMode === selectedMode;

const matchesSalary =
  salaryRange === "All" ||
  (salaryRange === "80k" && job.salary >= 80000) ||
  (salaryRange === "100k" && job.salary >= 100000) ||
  (salaryRange === "120k" && job.salary >= 120000);

return (
  !isApplied &&
  matchesSearch &&
  matchesLocation &&
  matchesType &&
  matchesMode &&
  matchesSalary
);

  });

  const layoutFont =
    "font-sans text-[#2d2d2d] [font-family:Inter,Arial,Helvetica,sans-serif]";

  if (page === "auth") {
    return (
      <div className={`min-h-screen bg-[#f7f7f7] ${layoutFont}`}>
        <nav className="bg-white border-b border-[#e4e2e0] px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#003a9b] text-white flex items-center justify-center">
              <Briefcase size={25} />
            </div>
            <h1 className="text-[30px] font-extrabold text-[#003a9b] tracking-[-0.04em]">
              Smart Job Tracker
            </h1>
          </div>
        </nav>

        <section className="bg-[#06245c] text-white">
          <div className="max-w-7xl mx-auto px-8 py-20">
            <h2 className="text-[44px] md:text-[54px] leading-[1.05] font-extrabold tracking-[-0.045em]">
              Job search made organized,
              <br />
              faster, and professional.
            </h2>

            <p className="mt-5 text-[18px] leading-8 text-blue-100 max-w-2xl">
              Search jobs, submit applications, receive email confirmations, and
              track every applied role from one clean workspace.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8">
          <div className="bg-white max-w-xl mx-auto -mt-14 rounded-[18px] border border-[#e4e2e0] shadow-[0_10px_35px_rgba(0,0,0,0.14)] p-8">
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#2d2d2d]">
              {authMode === "signup" ? "Create account" : "Sign in"}
            </h1>

            <p className="text-[15px] text-[#595959] mt-2 mb-6">
              {authMode === "signup"
                ? "Create your profile and start applying."
                : "Access your job tracker dashboard."}
            </p>

            <div className="flex bg-[#f3f2f1] rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`w-full p-3 rounded-lg font-bold text-[15px] ${
                  authMode === "signup"
                    ? "bg-white text-[#003a9b] shadow-sm"
                    : "text-[#595959]"
                }`}
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`w-full p-3 rounded-lg font-bold text-[15px] ${
                  authMode === "signin"
                    ? "bg-white text-[#003a9b] shadow-sm"
                    : "text-[#595959]"
                }`}
              >
                Sign In
              </button>
            </div>

            {authMode === "signup" ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <InputWithIcon icon={<User size={19} />} name="name" placeholder="Full name" />
                <InputWithIcon icon={<Mail size={19} />} name="email" type="email" placeholder="Email address" />
                <InputWithIcon icon={<Lock size={19} />} name="password" type="password" placeholder="Create password" />

                <button className="w-full bg-[#2557a7] hover:bg-[#1f4b8f] text-white p-4 rounded-lg font-extrabold text-[16px]">
                  Create Account
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignin} className="space-y-4">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full border border-[#949494] p-4 rounded-lg text-[16px] outline-none focus:ring-2 focus:ring-[#2557a7]"
                />

                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full border border-[#949494] p-4 rounded-lg text-[16px] outline-none focus:ring-2 focus:ring-[#2557a7]"
                />

                <button className="w-full bg-[#2557a7] hover:bg-[#1f4b8f] text-white p-4 rounded-lg font-extrabold text-[16px]">
                  Sign In
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    );
  }

  if (page === "admin") {
    return (
      <div className={`min-h-screen bg-[#f7f7f7] ${layoutFont}`}>
        <TopBar
          title="Admin Dashboard"
          subtitle="Manage jobs and review submitted applications"
          icon={<ShieldCheck size={26} />}
          right={
            <div className="flex gap-3">
              <button
                onClick={() => setShowPostJob(true)}
                className="bg-[#2557a7] text-white px-5 py-2.5 rounded-lg font-bold text-[15px]"
              >
                Post Job
              </button>

              <button
                onClick={confirmLogout}
                className="border border-[#949494] px-5 py-2.5 rounded-lg font-bold text-[15px]"
              >
                Logout
              </button>
            </div>
          }
        />

        <main className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <MetricCard label="Applications" value={adminApplications.length} />
            <MetricCard label="Posted Jobs" value={jobs.length} />
            <MetricCard
              label="Latest Applicant"
              value={adminApplications[0]?.applicantName || "No data"}
              small
            />
            <MetricCard label="Role" value="Administrator" small />
          </div>

          <section className="bg-white border border-[#e4e2e0] rounded-xl mb-8 overflow-hidden">
            <SectionHeader
              title="Posted Jobs"
              action={
                <button
                  onClick={() => setShowPostJob(true)}
                  className="bg-[#2557a7] text-white px-4 py-2 rounded-lg font-bold"
                >
                  Add Job
                </button>
              }
            />

            <div className="divide-y divide-[#e4e2e0]">
              {jobs.map((job) => (
                <div key={job._id} className="p-5 flex justify-between gap-4">
                  <div>
                    <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#595959] mt-1">
                      {job.company} • {job.location} • {job.workMode}
                    </p>
                    <p className="text-sm text-[#595959]">
                      {job.type} • ${Number(job.salary).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteJob(job._id)}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold h-fit"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-[#e4e2e0] rounded-xl overflow-hidden">
            <SectionHeader title="Submitted Applications" />

            <div className="divide-y divide-[#e4e2e0]">
              {adminApplications.map((app) => (
                <div key={app._id} className="p-6">
                  <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">
                    {app.applicantName}
                  </h3>
                  <p className="text-[#595959] mt-1">{app.applicantEmail}</p>
                  <p className="text-[#595959]">{app.applicantPhone}</p>

                  <p className="mt-4 font-bold">
                    {app.jobTitle} at {app.company}
                  </p>

                  <p className="text-sm text-[#595959]">
                    {app.location} • {app.workMode}
                  </p>

                  <div className="mt-4 bg-[#f3f2f1] rounded-lg p-4 text-sm leading-7">
                    <p>Education: {app.applicantEducation}</p>
                    <p>University: {app.applicantUniversity}</p>
                    <p>Graduation: {app.applicantGraduationYear}</p>
                    <p>Experience: {app.experience}</p>
                    <p>Resume: {app.applicantResume}</p>
                  </div>
                </div>
              ))}

              {adminApplications.length === 0 && (
                <p className="text-center text-[#595959] py-10">
                  No applications submitted yet.
                </p>
              )}
            </div>
          </section>
        </main>

        {showPostJob && (
          <PostJobModal
            onClose={() => setShowPostJob(false)}
            onSubmit={handlePostJob}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f7f7f7] ${layoutFont}`}>
      <TopBar
        title="Smart Job Tracker"
        subtitle="Search, apply, and track applications"
        icon={<Briefcase size={27} />}
        right={
          <div className="flex gap-3">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 border border-[#949494] px-4 py-2.5 rounded-lg font-bold text-[15px]"
            >
              <UserCircle size={18} />
              Profile
            </button>

            <button
              onClick={confirmLogout}
              className="border border-[#949494] px-4 py-2.5 rounded-lg font-bold text-[15px]"
            >
              Logout
            </button>
          </div>
        }
      />

      <section className="bg-[#06245c] text-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h2 className="text-[42px] md:text-[50px] leading-[1.05] font-extrabold tracking-[-0.045em]">
            Find your next opportunity
          </h2>

          <div className="bg-white rounded-[14px] p-5 mt-9 shadow-[0_10px_28px_rgba(0,0,0,0.22)] grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[#2d2d2d] font-extrabold text-[15px]">
                What
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title or company"
                className="mt-2 w-full border border-[#767676] p-4 rounded-lg text-[#2d2d2d] text-[16px] outline-none focus:ring-2 focus:ring-[#2557a7]"
              />
            </div>

            <div>
              <label className="text-[#2d2d2d] font-extrabold text-[15px]">
                Where
              </label>
              <input
                placeholder="United States"
                className="mt-2 w-full border border-[#767676] p-4 rounded-lg text-[#2d2d2d] text-[16px]"
              />
            </div>

            <button className="self-end bg-[#2557a7] hover:bg-[#1f4b8f] text-white p-4 rounded-lg font-extrabold text-[17px]">
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
        <aside className="bg-white rounded-xl p-6 border border-[#e4e2e0] h-fit">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal size={20} />
            <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">
              Filters
            </h2>
          </div>

          <FilterSelect
            label="Job Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={["All", "Data Analyst", "Data Engineer", "Software Engineer", "Cloud Engineer"]}
          />

          <FilterSelect
            label="Work Mode"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            options={["All", "Remote", "Hybrid", "Onsite"]}
          />

          <FilterSelect
            label="Salary Range"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            options={[
              { label: "All", value: "All" },
              { label: "$80,000+", value: "80k" },
              { label: "$100,000+", value: "100k" },
              { label: "$120,000+", value: "120k" },
            ]}
          />
        </aside>

        <main className="lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[28px] font-extrabold tracking-[-0.035em]">
              Available Jobs
            </h2>
            <p className="text-sm text-[#595959]">{filteredJobs.length} open roles</p>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <article
                key={job._id}
                className="bg-white rounded-xl p-6 border border-[#e4e2e0] hover:border-[#2557a7] hover:shadow-md transition"
              >
                <div className="flex justify-between gap-5">
                  <div>
                    <h3 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#2d2d2d]">
                      {job.title}
                    </h3>

                    <p className="text-[#595959] flex items-center gap-2 mt-2 text-[15px]">
                      <Building2 size={17} /> {job.company}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-[14px] text-[#595959]">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} /> {job.location}
                      </span>
                      <span>{job.workMode}</span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} /> ${Number(job.salary).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[#4b4b4b] mt-4 text-[15px] leading-7">
                      {job.description}
                    </p>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {job.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#eef3fe] text-[#2557a7] px-3 py-1 rounded-md text-[13px] font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-[#2557a7] hover:bg-[#1f4b8f] text-white px-5 py-3 rounded-lg h-fit font-extrabold text-[15px]"
                  >
                    Apply
                  </button>
                </div>
              </article>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-xl border border-[#e4e2e0] p-10 text-center text-[#595959]">
                No jobs found for selected filters.
              </div>
            )}
          </div>
        </main>

        <aside className="bg-white rounded-xl p-6 border border-[#e4e2e0] h-fit">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] mb-4">
            Applied Jobs
          </h2>

          <div className="bg-[#eef3fe] text-[#003a9b] p-4 rounded-lg mb-5 flex items-center gap-2 font-extrabold">
            <CheckCircle2 size={20} />
            {appliedJobs.length} Applied
          </div>

          <div className="space-y-4">
            {appliedJobs.map((job) => (
              <div key={job.jobId} className="border border-[#e4e2e0] rounded-lg p-4">
                <h3 className="font-extrabold text-[16px]">{job.jobTitle}</h3>
                <p className="text-sm text-[#595959]">{job.company}</p>
                <p className="text-xs text-[#003a9b] mt-2 font-bold">
                  Applied on {job.appliedDate}
                </p>

                <button
                  onClick={() => setSelectedAppliedJob(job)}
                  className="mt-3 text-sm font-extrabold text-[#2557a7] underline"
                >
                  View Job Details
                </button>
              </div>
            ))}

            {appliedJobs.length === 0 && (
              <p className="text-[#595959] text-sm">
                No applications submitted yet.
              </p>
            )}
          </div>
        </aside>
      </div>

      {showProfile && (
        <ProfileModal
          account={account}
          onClose={() => setShowProfile(false)}
          onSubmit={handleProfileUpdate}
        />
      )}

      {selectedJob && (
        <ApplyModal
          selectedJob={selectedJob}
          account={account}
          onClose={() => setSelectedJob(null)}
          onSubmit={submitApplication}
        />
      )}

      {selectedAppliedJob && (
        <AppliedJobModal
          job={selectedAppliedJob}
          onClose={() => setSelectedAppliedJob(null)}
        />
      )}
    </div>
  );
}

function InputWithIcon({ icon, name, type = "text", placeholder }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 text-[#767676]">{icon}</div>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full border border-[#949494] p-4 pl-12 rounded-lg text-[16px] outline-none focus:ring-2 focus:ring-[#2557a7]"
      />
    </div>
  );
}

function TopBar({ title, subtitle, icon, right }) {
  return (
    <nav className="bg-white border-b border-[#e4e2e0] px-8 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#eef3fe] text-[#003a9b] flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-[30px] font-extrabold text-[#003a9b] tracking-[-0.045em]">
              {title}
            </h1>
            <p className="text-sm text-[#595959]">{subtitle}</p>
          </div>
        </div>

        {right}
      </div>
    </nav>
  );
}

function MetricCard({ label, value, small }) {
  return (
    <div className="bg-white border border-[#e4e2e0] rounded-xl p-5">
      <p className="text-sm text-[#595959] font-bold">{label}</p>
      <h2
        className={`font-extrabold tracking-[-0.03em] mt-2 ${
          small ? "text-[20px]" : "text-[38px]"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="px-6 py-5 border-b border-[#e4e2e0] flex justify-between items-center">
      <h2 className="text-[24px] font-extrabold tracking-[-0.03em]">
        {title}
      </h2>
      {action}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="mb-5">
      <label className="text-sm font-extrabold text-[#595959]">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-[#949494] p-3 rounded-lg mt-2 bg-white text-[15px]"
      >
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option}>{option}</option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function ProfileModal({ account, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-2xl">
        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] mb-6">
          Edit Profile
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            required
            defaultValue={account?.name}
            className="w-full border border-[#949494] p-4 rounded-lg text-[16px]"
          />
          <input
            name="email"
            type="email"
            required
            defaultValue={account?.email}
            className="w-full border border-[#949494] p-4 rounded-lg text-[16px]"
          />

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="w-full border p-4 rounded-lg font-bold">
              Cancel
            </button>

            <button type="submit" className="w-full bg-[#2557a7] text-white p-4 rounded-lg font-bold">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PostJobModal({ onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-2xl">
        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] mb-6">
          Post a New Job
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" required placeholder="e.g. Frontend React Developer" className="border border-[#949494] p-4 rounded-lg" />
          <input name="company" required placeholder="Company" className="border border-[#949494] p-4 rounded-lg" />

          <select name="type" required className="border border-[#949494] p-4 rounded-lg bg-white">
            <option>Data Analyst</option>
            <option>Data Engineer</option>
            <option>Software Engineer</option>
            <option>Cloud Engineer</option>
          </select>

          <select name="workMode" required className="border border-[#949494] p-4 rounded-lg bg-white">
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>

          <input name="salary" required type="number" placeholder="Salary" className="border border-[#949494] p-4 rounded-lg" />
          <input name="location" required placeholder="Location" className="border border-[#949494] p-4 rounded-lg" />
          <input name="skills" required placeholder="Skills comma separated" className="md:col-span-2 border border-[#949494] p-4 rounded-lg" />
          <textarea name="description" required placeholder="Job description" className="md:col-span-2 border border-[#949494] p-4 rounded-lg min-h-28" />

          <div className="md:col-span-2 flex gap-3">
            <button type="button" onClick={onClose} className="w-full border p-4 rounded-lg font-bold">
              Cancel
            </button>

            <button type="submit" className="w-full bg-[#2557a7] text-white p-4 rounded-lg font-bold">
              Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplyModal({ selectedJob, account, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-6">
          <div className="bg-[#eef3fe] p-3 rounded-lg text-[#2557a7]">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.03em]">
              Apply for {selectedJob.title}
            </h2>
            <p className="text-[#595959]">
              {selectedJob.company} • {selectedJob.location}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" required placeholder="Full name" defaultValue={account?.name} className="border border-[#949494] p-4 rounded-lg" />
          <input name="email" type="email" required placeholder="Email address" defaultValue={account?.email} className="border border-[#949494] p-4 rounded-lg" />
          <input name="phone" required placeholder="Phone number" className="border border-[#949494] p-4 rounded-lg" />

          <select name="gender" required className="border border-[#949494] p-4 rounded-lg bg-white">
            <option value="">Select gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>

          <input name="education" required placeholder="Highest education" className="border border-[#949494] p-4 rounded-lg" />
          <input name="university" required placeholder="University / College" className="border border-[#949494] p-4 rounded-lg" />
          <input name="graduationYear" required placeholder="Graduation year" className="border border-[#949494] p-4 rounded-lg" />
          <input name="experience" required placeholder="Years of experience" className="border border-[#949494] p-4 rounded-lg" />
          <input name="expectedSalary" required placeholder="Expected salary" className="border border-[#949494] p-4 rounded-lg" />

          <select name="availability" required className="border border-[#949494] p-4 rounded-lg bg-white">
            <option value="">Availability to start</option>
            <option>Immediately</option>
            <option>2 weeks</option>
            <option>1 month</option>
          </select>

          <input name="resume" required placeholder="Resume link / portfolio link" className="md:col-span-2 border border-[#949494] p-4 rounded-lg" />
          <textarea name="coverLetter" required placeholder="Cover letter / message to recruiter" className="md:col-span-2 border border-[#949494] p-4 rounded-lg min-h-28" />

          <div className="md:col-span-2 flex gap-3">
            <button type="button" onClick={onClose} className="w-full border p-4 rounded-lg font-bold">
              Cancel
            </button>

            <button type="submit" className="w-full bg-[#2557a7] text-white p-4 rounded-lg font-bold">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppliedJobModal({ job, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-3xl rounded-[18px] shadow-2xl overflow-hidden">
        <div className="bg-[#06245c] text-white px-8 py-7 flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-[14px] font-bold mb-2">
              Applied Job Details
            </p>
            <h2 className="text-[34px] font-extrabold tracking-[-0.045em] leading-tight">
              {job.jobTitle}
            </h2>
            <p className="text-blue-100 mt-2 text-[16px]">
              {job.company} • Applied on {job.appliedDate}
            </p>
          </div>

          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">
            <X size={22} />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
            <InfoCard label="Location" value={job.location} />
            <InfoCard label="Work Mode" value={job.workMode} />
            <InfoCard
              label="Salary"
              value={`$${Number(job.salary || 0).toLocaleString()}`}
            />
          </div>

          <div className="bg-[#f7f7f7] border border-[#e4e2e0] rounded-xl p-6 mb-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.025em] mb-3">
              Job Description
            </h3>
            <p className="text-[#4b4b4b] leading-7 text-[15px]">
              {job.description || "No description available."}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#e4e2e0] pt-5">
            <div>
              <p className="text-sm text-[#595959]">Application status</p>
              <p className="font-extrabold text-[#003a9b]">Applied</p>
            </div>

            <button
              onClick={onClose}
              className="bg-[#2557a7] hover:bg-[#1f4b8f] text-white px-6 py-3 rounded-lg font-extrabold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border border-[#e4e2e0] rounded-xl p-4 bg-white">
      <p className="text-[13px] text-[#595959] font-bold mb-1">{label}</p>
      <p className="text-[16px] font-extrabold text-[#2d2d2d]">{value}</p>
    </div>
  );
}

export default App;