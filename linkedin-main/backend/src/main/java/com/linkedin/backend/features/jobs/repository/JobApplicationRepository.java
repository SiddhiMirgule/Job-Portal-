package com.linkedin.backend.features.jobs.repository;

import com.linkedin.backend.features.jobs.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantIdOrderByAppliedAtDesc(Long applicantId);
    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
}
