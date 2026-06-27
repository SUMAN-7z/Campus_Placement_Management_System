package com.placement.mgt.service;

import com.placement.mgt.dto.InterviewDto;
import com.placement.mgt.entity.Application;
import com.placement.mgt.entity.Interview;
import com.placement.mgt.entity.Student;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.ApplicationRepository;
import com.placement.mgt.repository.InterviewRepository;
import com.placement.mgt.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    @Transactional
    public InterviewDto scheduleInterview(InterviewDto dto) {
        Application application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Interview interview = Interview.builder()
                .application(application)
                .date(dto.getDate())
                .time(dto.getTime())
                .mode(dto.getMode())
                .meetingLink(dto.getMeetingLink())
                .status("SCHEDULED")
                .build();

        Interview saved = interviewRepository.save(interview);

        // Enforce application status transition
        application.setStatus("INTERVIEW_SCHEDULED");
        applicationRepository.save(application);

        // Notify Student
        String title = "Interview Scheduled: " + application.getJob().getTitle();
        String message = "Your interview for the position of " + application.getJob().getTitle() + 
                " at " + application.getJob().getCompany().getCompanyName() + " has been scheduled on " +
                saved.getDate() + " at " + saved.getTime() + " (" + saved.getMode() + ").";
        
        if ("ONLINE".equalsIgnoreCase(saved.getMode()) && saved.getMeetingLink() != null) {
            message += " Meeting Link: " + saved.getMeetingLink();
        }

        notificationService.createNotification(
                application.getStudent().getUser().getId(),
                title,
                message,
                "INTERVIEW"
        );

        return convertToDto(saved);
    }

    @Transactional
    public InterviewDto updateFeedback(Long id, String feedback, String status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        interview.setFeedback(feedback);
        interview.setStatus(status.toUpperCase());
        Interview updated = interviewRepository.save(interview);

        // Notify student about feedback
        notificationService.createNotification(
                interview.getApplication().getStudent().getUser().getId(),
                "Interview Update: " + interview.getApplication().getJob().getTitle(),
                "Feedback has been updated for your interview scheduled on " + interview.getDate() + ". Status: " + status,
                "INTERVIEW"
        );

        return convertToDto(updated);
    }

    public List<InterviewDto> getStudentInterviews(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return interviewRepository.findByApplicationStudentId(student.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<InterviewDto> getCompanyInterviews(Long companyId) {
        return interviewRepository.findByApplicationJobCompanyId(companyId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<InterviewDto> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private InterviewDto convertToDto(Interview interview) {
        return InterviewDto.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .studentId(interview.getApplication().getStudent().getId())
                .studentName(interview.getApplication().getStudent().getName())
                .studentEmail(interview.getApplication().getStudent().getUser().getEmail())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .companyName(interview.getApplication().getJob().getCompany().getCompanyName())
                .date(interview.getDate())
                .time(interview.getTime())
                .mode(interview.getMode())
                .meetingLink(interview.getMeetingLink())
                .feedback(interview.getFeedback())
                .status(interview.getStatus())
                .build();
    }
}