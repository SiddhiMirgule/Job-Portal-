package com.linkedin.backend.features.jobs.dto;

import com.linkedin.backend.features.jobs.model.JobType;
import com.linkedin.backend.features.jobs.model.WorkType;

public class JobDto {
    private String title;
    private String company;
    private String location;
    private String description;
    private JobType jobType;
    private WorkType workType;
    private String salary;
    private String requirements;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public WorkType getWorkType() { return workType; }
    public void setWorkType(WorkType workType) { this.workType = workType; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
}
