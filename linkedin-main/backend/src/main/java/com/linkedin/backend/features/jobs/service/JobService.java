package com.linkedin.backend.features.jobs.service;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.authentication.repository.UserRepository;
import com.linkedin.backend.features.jobs.dto.JobApplicationDto;
import com.linkedin.backend.features.jobs.dto.JobDto;
import com.linkedin.backend.features.jobs.model.*;
import com.linkedin.backend.features.jobs.repository.JobApplicationRepository;
import com.linkedin.backend.features.jobs.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public Job createJob(JobDto dto, Long posterId) {
        User poster = userRepository.findById(posterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Job job = new Job(dto.getTitle(), dto.getCompany(), dto.getLocation(),
                dto.getDescription(), dto.getJobType(), dto.getWorkType(),
                dto.getSalary(), dto.getRequirements(), poster);
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByCreationDateDesc();
    }

    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<Job> getJobsByPoster(Long posterId) {
        return jobRepository.findByPosterIdOrderByCreationDateDesc(posterId);
    }

    public List<Job> searchJobs(String keyword, String location, String jobType, String workType) {
        JobType jt = (jobType != null && !jobType.isBlank()) ? JobType.valueOf(jobType) : null;
        WorkType wt = (workType != null && !workType.isBlank()) ? WorkType.valueOf(workType) : null;
        String kw = (keyword != null && !keyword.isBlank()) ? keyword : null;
        String loc = (location != null && !location.isBlank()) ? location : null;
        return jobRepository.searchJobs(kw, loc, jt, wt);
    }

    public void deleteJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getPoster().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this job");
        }
        jobRepository.delete(job);
    }

    public JobApplication applyToJob(Long jobId, Long applicantId, JobApplicationDto dto) {
        if (jobApplicationRepository.existsByJobIdAndApplicantId(jobId, applicantId)) {
            throw new IllegalArgumentException("You have already applied to this job");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        JobApplication application = new JobApplication(job, applicant, dto.getCoverLetter());
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getMyApplications(Long applicantId) {
        return jobApplicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicantId);
    }

    public List<JobApplication> getApplicationsForJob(Long jobId, Long requesterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getPoster().getId().equals(requesterId)) {
            throw new IllegalArgumentException("You are not authorized to view these applications");
        }
        return jobApplicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public boolean hasApplied(Long jobId, Long applicantId) {
        return jobApplicationRepository.existsByJobIdAndApplicantId(jobId, applicantId);
    }
}
