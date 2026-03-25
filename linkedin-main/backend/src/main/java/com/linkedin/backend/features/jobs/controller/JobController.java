package com.linkedin.backend.features.jobs.controller;

import com.linkedin.backend.dto.Response;
import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.jobs.dto.JobApplicationDto;
import com.linkedin.backend.features.jobs.dto.JobDto;
import com.linkedin.backend.features.jobs.model.Job;
import com.linkedin.backend.features.jobs.model.JobApplication;
import com.linkedin.backend.features.jobs.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody JobDto dto,
                                         @RequestAttribute("authenticatedUser") User user) {
        return ResponseEntity.ok(jobService.createJob(dto, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String workType) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, location, jobType, workType));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Job>> getJobsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getJobsByPoster(userId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Response> deleteJob(@PathVariable Long jobId,
                                               @RequestAttribute("authenticatedUser") User user) {
        jobService.deleteJob(jobId, user.getId());
        return ResponseEntity.ok(new Response("Job deleted successfully."));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<JobApplication> applyToJob(@PathVariable Long jobId,
                                                      @RequestBody JobApplicationDto dto,
                                                      @RequestAttribute("authenticatedUser") User user) {
        return ResponseEntity.ok(jobService.applyToJob(jobId, user.getId(), dto));
    }

    @GetMapping("/applications/my")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            @RequestAttribute("authenticatedUser") User user) {
        return ResponseEntity.ok(jobService.getMyApplications(user.getId()));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(
            @PathVariable Long jobId,
            @RequestAttribute("authenticatedUser") User user) {
        return ResponseEntity.ok(jobService.getApplicationsForJob(jobId, user.getId()));
    }

    @GetMapping("/{jobId}/applied")
    public ResponseEntity<Map<String, Boolean>> hasApplied(
            @PathVariable Long jobId,
            @RequestAttribute("authenticatedUser") User user) {
        return ResponseEntity.ok(Map.of("applied", jobService.hasApplied(jobId, user.getId())));
    }
}
