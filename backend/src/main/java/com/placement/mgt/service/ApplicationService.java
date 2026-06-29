package com.placement.mgt.service;

import com.placement.mgt.dto.ApplicationDto;
import com.placement.mgt.entity.Application;
import com.placement.mgt.entity.Job;
import com.placement.mgt.entity.Student;
import com.placement.mgt.exception.BadRequestException;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.ApplicationRepository;
import com.placement.mgt.repository.JobRepository;
import com.placement.mgt.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationDto applyForJob(Long userId, Long jobId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found. Please complete registration."));

        if (!student.getIsVerified()) {
            throw new BadRequestException("Your profile must be verified by the placement officer before applying for jobs.");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found."));

        if (LocalDate.now().isAfter(job.getDeadline())) {
            throw new BadRequestException("The application deadline for this job has passed.");
        }

        if (student.getCgpa() == null || student.getCgpa().compareTo(job.getMinCgpa()) < 0) {
            throw new BadRequestException("Your CGPA (" + student.getCgpa() + ") does not meet the minimum CGPA requirement (" + job.getMinCgpa() + ") for this job.");
        }

        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), jobId)) {
            throw new BadRequestException("You have already applied for this job.");
        }

        if (student.getResumePath() == null || student.getResumePath().isBlank()) {
            throw new BadRequestException("Please upload your resume in the profile section before applying.");
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status("APPLIED")
                .resumePath(student.getResumePath())
                .build();

        Application saved = applicationRepository.save(application);

        // Notify Student
        notificationService.createNotification(
                student.getUser().getId(),
                "Application Submitted",
                "You have successfully applied for the position of " + job.getTitle() + " at " + job.getCompany().getCompanyName() + ".",
                "JOB"
        );

        return convertToDto(saved);
    }

    @Transactional
    public void withdrawApplication(Long userId, Long jobId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        
        Application application = applicationRepository.findByStudentIdAndJobId(student.getId(), jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        applicationRepository.delete(application);
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String status, String remarks) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setStatus(status.toUpperCase());
        application.setRemarks(remarks);
        Application updated = applicationRepository.save(application);

        // Send notification about status update
        String title = "Application Update: " + application.getJob().getTitle();
        String message = "Your application status for " + application.getJob().getTitle() + " at " + 
                application.getJob().getCompany().getCompanyName() + " has been updated to: " + status.replace("_", " ") + ".";
        
        if (remarks != null && !remarks.isBlank()) {
            message += " HR Remarks: " + remarks;
        }

        notificationService.createNotification(
                application.getStudent().getUser().getId(),
                title,
                message,
                "JOB"
        );

        return convertToDto(updated);
    }

    public List<ApplicationDto> getStudentApplications(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return applicationRepository.findByStudentId(student.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getJobApplicants(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getCompanyApplicants(Long companyId) {
        return applicationRepository.findByJobCompanyId(companyId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return convertToDto(application);
    }

    private ApplicationDto convertToDto(Application app) {
        return ApplicationDto.builder()
                .id(app.getId())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getName())
                .studentEmail(app.getStudent().getUser().getEmail())
                .studentPhone(app.getStudent().getPhone())
                .studentBranch(app.getStudent().getBranch())
                .studentCgpa(app.getStudent().getCgpa())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getCompanyName())
                .status(app.getStatus())
                .resumePath(app.getResumePath())
                .appliedAt(app.getAppliedAt())
                .remarks(app.getRemarks())
                .build();
    }
}
