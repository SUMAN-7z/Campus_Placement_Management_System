package com.placement.mgt.controller;

import com.placement.mgt.dto.*;
import com.placement.mgt.entity.Notification;
import com.placement.mgt.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentController {

    private final ProfileService profileService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final InterviewService interviewService;
    private final NotificationService notificationService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<StudentProfileDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getStudentByUserId(userId));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<StudentProfileDto> updateProfile(
            @PathVariable Long userId, 
            @RequestBody StudentProfileDto dto
    ) {
        return ResponseEntity.ok(profileService.updateStudentProfile(userId, dto));
    }

    @PostMapping("/profile/{userId}/resume")
    public ResponseEntity<StudentProfileDto> uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(profileService.uploadResume(userId, file));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getAllJobs(@RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(jobService.searchJobs(search));
    }

    @GetMapping("/jobs/eligible/{userId}")
    public ResponseEntity<List<JobDto>> getEligibleJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getEligibleJobsForStudent(userId));
    }

    @PostMapping("/jobs/apply")
    public ResponseEntity<ApplicationDto> applyForJob(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long jobId = payload.get("jobId");
        return ResponseEntity.ok(applicationService.applyForJob(userId, jobId));
    }

    @DeleteMapping("/jobs/withdraw")
    public ResponseEntity<Map<String, String>> withdrawApplication(@RequestParam Long userId, @RequestParam Long jobId) {
        applicationService.withdrawApplication(userId, jobId);
        return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully"));
    }

    @GetMapping("/applications/{userId}")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getStudentApplications(userId));
    }

    @GetMapping("/interviews/{userId}")
    public ResponseEntity<List<InterviewDto>> getMyInterviews(@PathVariable Long userId) {
        return ResponseEntity.ok(interviewService.getStudentInterviews(userId));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<Notification>> getMyNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId));
    }

    @GetMapping("/notifications/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Map<String, String>> markNotificationRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
}
