import { useEffect, useState } from "react";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { request } from "../../../../utils/api";
import classes from "./Jobs.module.scss";

export interface IJob {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  workType: string;
  salary: string;
  requirements: string;
  poster: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    position: string;
    company: string;
  };
  creationDate: string;
}

interface IJobApplication {
  id: number;
  job: IJob;
  coverLetter: string;
  status: string;
  appliedAt: string;
}

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY", "VOLUNTEER"];
const WORK_TYPES = ["ON_SITE", "REMOTE", "HYBRID"];

function formatLabel(val: string) {
  return val.replace(/_/g, " ");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function Jobs() {
  const { user } = useAuthentication();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [myApplications, setMyApplications] = useState<IJobApplication[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [error, setError] = useState("");

  // search & filter
  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");

  // post job form
  const [postForm, setPostForm] = useState({
    title: "", company: user?.company || "", location: user?.location || "",
    description: "", jobType: "FULL_TIME", workType: "ON_SITE", salary: "", requirements: "",
  });

  // apply form
  const [coverLetter, setCoverLetter] = useState("");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  function fetchJobs(kw = "", loc = "", jt = "", wt = "") {
    setLoading(true);
    const params = new URLSearchParams();
    if (kw) params.set("keyword", kw);
    if (loc) params.set("location", loc);
    if (jt) params.set("jobType", jt);
    if (wt) params.set("workType", wt);
    const qs = params.toString();
    const endpoint = qs ? `/api/v1/jobs/search?${qs}` : "/api/v1/jobs";
    request<IJob[]>({
      endpoint,
      onSuccess: (data) => { setJobs(data); setLoading(false); },
      onFailure: (e) => { setError(e); setLoading(false); },
    });
  }

  function fetchMyApplications() {
    request<IJobApplication[]>({
      endpoint: "/api/v1/jobs/applications/my",
      onSuccess: (data) => {
        setMyApplications(data);
        setAppliedJobIds(new Set(data.map((a) => a.job.id)));
      },
      onFailure: () => {},
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchJobs(keyword, locationFilter, jobTypeFilter, workTypeFilter);
  }

  function handleClearFilters() {
    setKeyword(""); setLocationFilter(""); setJobTypeFilter(""); setWorkTypeFilter("");
    fetchJobs();
  }

  function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    request<IJob>({
      endpoint: "/api/v1/jobs",
      method: "POST",
      body: JSON.stringify(postForm),
      onSuccess: (data) => {
        setJobs([data, ...jobs]);
        setShowPostModal(false);
        setPostForm({ title: "", company: user?.company || "", location: user?.location || "", description: "", jobType: "FULL_TIME", workType: "ON_SITE", salary: "", requirements: "" });
      },
      onFailure: (e) => setError(e),
    });
  }

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedJob) return;
    request<IJobApplication>({
      endpoint: `/api/v1/jobs/${selectedJob.id}/apply`,
      method: "POST",
      body: JSON.stringify({ coverLetter }),
      onSuccess: (data) => {
        setMyApplications([data, ...myApplications]);
        setAppliedJobIds((prev) => new Set([...prev, selectedJob.id]));
        setShowApplyModal(false);
        setCoverLetter("");
        setApplyError("");
      },
      onFailure: (e) => setApplyError(e),
    });
  }

  function handleDeleteJob(jobId: number) {
    request<{ message: string }>({
      endpoint: `/api/v1/jobs/${jobId}`,
      method: "DELETE",
      onSuccess: () => {
        setJobs(jobs.filter((j) => j.id !== jobId));
        if (selectedJob?.id === jobId) setSelectedJob(null);
      },
      onFailure: (e) => setError(e),
    });
  }

  const displayedJobs = activeTab === "mine"
    ? myApplications.map((a) => a.job)
    : jobs;

  return (
    <div className={classes.root}>
      {/* Left: Filters */}
      <aside className={classes.sidebar}>
        <div className={classes.sidebarCard}>
          <h3 className={classes.sidebarTitle}>Search Jobs</h3>
          <form onSubmit={handleSearch} className={classes.filterForm}>
            <input
              className={classes.filterInput}
              placeholder="Job title, keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              className={classes.filterInput}
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <select
              className={classes.filterSelect}
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="">All job types</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{formatLabel(t)}</option>
              ))}
            </select>
            <select
              className={classes.filterSelect}
              value={workTypeFilter}
              onChange={(e) => setWorkTypeFilter(e.target.value)}
            >
              <option value="">All work types</option>
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>{formatLabel(t)}</option>
              ))}
            </select>
            <button type="submit" className={classes.searchBtn}>Search</button>
            <button type="button" className={classes.clearBtn} onClick={handleClearFilters}>Clear</button>
          </form>
        </div>

        <div className={classes.sidebarCard}>
          <button className={classes.postJobBtn} onClick={() => setShowPostModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1-9C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0-2c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z"/>
            </svg>
            Post a Job
          </button>
        </div>
      </aside>

      {/* Center: Job List */}
      <main className={classes.center}>
        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === "all" ? classes.activeTab : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Jobs {jobs.length > 0 && <span className={classes.count}>{jobs.length}</span>}
          </button>
          <button
            className={`${classes.tab} ${activeTab === "mine" ? classes.activeTab : ""}`}
            onClick={() => setActiveTab("mine")}
          >
            My Applications {myApplications.length > 0 && <span className={classes.count}>{myApplications.length}</span>}
          </button>
        </div>

        {error && <div className={classes.error}>{error}</div>}

        {loading ? (
          <div className={classes.loadingWrap}>
            <div className={classes.spinner} />
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className={classes.empty}>
            {activeTab === "all" ? "No jobs found. Try adjusting your filters." : "You haven't applied to any jobs yet."}
          </div>
        ) : (
          <div className={classes.jobList}>
            {displayedJobs.map((job) => (
              <div
                key={job.id}
                className={`${classes.jobCard} ${selectedJob?.id === job.id ? classes.selected : ""}`}
                onClick={() => setSelectedJob(job)}
              >
                <div className={classes.jobCardTop}>
                  <div className={classes.companyIcon}>
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  <div className={classes.jobCardInfo}>
                    <div className={classes.jobTitle}>{job.title}</div>
                    <div className={classes.jobCompany}>{job.company}</div>
                    <div className={classes.jobMeta}>
                      {job.location && <span>{job.location}</span>}
                      {job.workType && <span className={classes.badge}>{formatLabel(job.workType)}</span>}
                      {job.jobType && <span className={classes.badge}>{formatLabel(job.jobType)}</span>}
                    </div>
                    {job.salary && <div className={classes.salary}>{job.salary}</div>}
                  </div>
                </div>
                <div className={classes.jobCardFooter}>
                  <span className={classes.timeAgo}>{timeAgo(job.creationDate)}</span>
                  {appliedJobIds.has(job.id) && (
                    <span className={classes.appliedBadge}>Applied</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right: Job Detail */}
      <aside className={classes.detail}>
        {selectedJob ? (
          <div className={classes.detailCard}>
            <div className={classes.detailHeader}>
              <div className={classes.detailCompanyIcon}>
                {selectedJob.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className={classes.detailTitle}>{selectedJob.title}</h2>
                <div className={classes.detailCompany}>{selectedJob.company}</div>
                {selectedJob.location && (
                  <div className={classes.detailLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {selectedJob.location}
                  </div>
                )}
              </div>
            </div>

            <div className={classes.detailBadges}>
              {selectedJob.jobType && <span className={classes.detailBadge}>{formatLabel(selectedJob.jobType)}</span>}
              {selectedJob.workType && <span className={classes.detailBadge}>{formatLabel(selectedJob.workType)}</span>}
              {selectedJob.salary && <span className={`${classes.detailBadge} ${classes.salaryBadge}`}>{selectedJob.salary}</span>}
            </div>

            <div className={classes.detailActions}>
              {selectedJob.poster.id === user?.id ? (
                <button
                  className={classes.deleteBtn}
                  onClick={() => handleDeleteJob(selectedJob.id)}
                >
                  Delete Job
                </button>
              ) : appliedJobIds.has(selectedJob.id) ? (
                <button className={classes.appliedBtn} disabled>
                  Applied
                </button>
              ) : (
                <button
                  className={classes.applyBtn}
                  onClick={() => setShowApplyModal(true)}
                >
                  Easy Apply
                </button>
              )}
            </div>

            <div className={classes.detailSection}>
              <h4>About this job</h4>
              <p className={classes.detailText}>{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && (
              <div className={classes.detailSection}>
                <h4>Requirements</h4>
                <p className={classes.detailText}>{selectedJob.requirements}</p>
              </div>
            )}

            <div className={classes.detailSection}>
              <h4>Posted by</h4>
              <div className={classes.posterInfo}>
                <img
                  src={
                    selectedJob.poster.profilePicture
                      ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${selectedJob.poster.profilePicture}`
                      : "/avatar.svg"
                  }
                  alt=""
                  className={classes.posterAvatar}
                />
                <div>
                  <div className={classes.posterName}>
                    {selectedJob.poster.firstName} {selectedJob.poster.lastName}
                  </div>
                  {selectedJob.poster.position && (
                    <div className={classes.posterTitle}>
                      {selectedJob.poster.position}
                      {selectedJob.poster.company ? ` at ${selectedJob.poster.company}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={classes.detailPostedAt}>
              Posted {timeAgo(selectedJob.creationDate)}
            </div>
          </div>
        ) : (
          <div className={classes.detailPlaceholder}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M20 6h-2.18c.07-.44.18-.86.18-1a3 3 0 00-6 0c0 .14.11.56.18 1H10C8.9 6 8 6.9 8 8v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1a1 1 0 012 0c0 .14-.06.59-.1 1h-1.8c-.04-.41-.1-.86-.1-1zm7 15H10V8h2v2h6V8h2v12z"/>
            </svg>
            <p>Select a job to see details</p>
          </div>
        )}
      </aside>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className={classes.modalOverlay} onClick={() => setShowPostModal(false)}>
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h3>Post a Job</h3>
              <button className={classes.modalClose} onClick={() => setShowPostModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="16" height="16">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePostJob} className={classes.modalForm}>
              <div className={classes.formRow}>
                <div className={classes.formGroup}>
                  <label>Job Title *</label>
                  <input required placeholder="e.g. Senior Software Engineer" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} />
                </div>
                <div className={classes.formGroup}>
                  <label>Company *</label>
                  <input required placeholder="Company name" value={postForm.company} onChange={(e) => setPostForm({ ...postForm, company: e.target.value })} />
                </div>
              </div>
              <div className={classes.formRow}>
                <div className={classes.formGroup}>
                  <label>Location</label>
                  <input placeholder="e.g. New York, NY" value={postForm.location} onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} />
                </div>
                <div className={classes.formGroup}>
                  <label>Salary</label>
                  <input placeholder="e.g. $80,000 - $120,000" value={postForm.salary} onChange={(e) => setPostForm({ ...postForm, salary: e.target.value })} />
                </div>
              </div>
              <div className={classes.formRow}>
                <div className={classes.formGroup}>
                  <label>Job Type</label>
                  <select value={postForm.jobType} onChange={(e) => setPostForm({ ...postForm, jobType: e.target.value })}>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{formatLabel(t)}</option>)}
                  </select>
                </div>
                <div className={classes.formGroup}>
                  <label>Work Type</label>
                  <select value={postForm.workType} onChange={(e) => setPostForm({ ...postForm, workType: e.target.value })}>
                    {WORK_TYPES.map((t) => <option key={t} value={t}>{formatLabel(t)}</option>)}
                  </select>
                </div>
              </div>
              <div className={classes.formGroup}>
                <label>Job Description *</label>
                <textarea required rows={5} placeholder="Describe the role, responsibilities, and what you're looking for..." value={postForm.description} onChange={(e) => setPostForm({ ...postForm, description: e.target.value })} />
              </div>
              <div className={classes.formGroup}>
                <label>Requirements</label>
                <textarea rows={4} placeholder="List qualifications, skills, and experience required..." value={postForm.requirements} onChange={(e) => setPostForm({ ...postForm, requirements: e.target.value })} />
              </div>
              <div className={classes.modalActions}>
                <button type="button" className={classes.cancelBtn} onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className={classes.submitBtn}>Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className={classes.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h3>Apply — {selectedJob.title}</h3>
              <button className={classes.modalClose} onClick={() => setShowApplyModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="16" height="16">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleApply} className={classes.modalForm}>
              <div className={classes.applyInfo}>
                <img
                  src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user.profilePicture}` : "/avatar.svg"}
                  alt=""
                  className={classes.applyAvatar}
                />
                <div>
                  <div className={classes.applyName}>{user?.firstName} {user?.lastName}</div>
                  <div className={classes.applySubtitle}>{user?.position}{user?.company ? ` at ${user.company}` : ""}</div>
                </div>
              </div>
              {applyError && <div className={classes.error}>{applyError}</div>}
              <div className={classes.formGroup}>
                <label>Cover Letter (optional)</label>
                <textarea
                  rows={7}
                  placeholder="Tell the hiring manager why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className={classes.modalActions}>
                <button type="button" className={classes.cancelBtn} onClick={() => { setShowApplyModal(false); setApplyError(""); }}>Cancel</button>
                <button type="submit" className={classes.submitBtn}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
