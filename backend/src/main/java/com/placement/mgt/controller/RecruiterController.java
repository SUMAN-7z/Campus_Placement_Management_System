package com.placement.mgt.controller;

import com.placement.mgt.dto.*;
import com.placement.mgt.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
@RequiredArgsConstructor
public class RecruiterController {

    private final ProfileService profileService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final InterviewService interviewService;

    @GetMapping("/company/{companyId}")
    public ResponseEntity<CompanyDto> getCompanyProfile(@PathVariable Long companyId) {
        return ResponseEntity.ok(profileService.getCompanyById(companyId));
    }

    @PutMapping("/company/{companyId}")
    public ResponseEntity<CompanyDto> updateCompanyProfile(
            @PathVariable Long companyId, 
            @RequestBody CompanyDto dto
    ) {
        return ResponseEntity.ok(profileService.updateCompanyProfile(companyId, dto));
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobDto> createJob(@RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.createJob(dto));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, @RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.updateJob(id, dto));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    @GetMapping("/jobs/company/{companyId}")
    public ResponseEntity<List<JobDto>> getCompanyJobs(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }

    @GetMapping("/applicants/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getJobApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId));
    }

    @GetMapping("/applicants/company/{companyId}")
    public ResponseEntity<List<ApplicationDto>> getCompanyApplicants(@PathVariable Long companyId) {
        return ResponseEntity.ok(applicationService.getCompanyApplicants(companyId));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        String remarks = payload.get("remarks");
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, remarks));
    }

    @PostMapping("/interviews")
    public ResponseEntity<InterviewDto> scheduleInterview(@RequestBody InterviewDto dto) {
        return ResponseEntity.ok(interviewService.scheduleInterview(dto));
    }

    @GetMapping("/interviews/company/{companyId}")
    public ResponseEntity<List<InterviewDto>> getCompanyInterviews(@PathVariable Long companyId) {
        return ResponseEntity.ok(interviewService.getCompanyInterviews(companyId));
    }

    @PutMapping("/interviews/{id}/feedback")
    public ResponseEntity<InterviewDto> updateFeedback(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload
    ) {
        String feedback = payload.get("feedback");
        String status = payload.get("status");
        return ResponseEntity.ok(interviewService.updateFeedback(id, feedback, status));
    }
}
