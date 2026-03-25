package com.linkedin.backend.features.jobs.repository;

import com.linkedin.backend.features.jobs.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findAllByOrderByCreationDateDesc();
    List<Job> findByPosterIdOrderByCreationDateDesc(Long posterId);

    @Query("SELECT j FROM jobs j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:workType IS NULL OR j.workType = :workType) " +
            "ORDER BY j.creationDate DESC")
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") com.linkedin.backend.features.jobs.model.JobType jobType,
            @Param("workType") com.linkedin.backend.features.jobs.model.WorkType workType
    );
}
