package com.placement.mgt.service;

import com.placement.mgt.dto.JobDto;
import com.placement.mgt.entity.Company;
import com.placement.mgt.entity.Job;
import com.placement.mgt.entity.Student;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.CompanyRepository;
import com.placement.mgt.repository.JobRepository;
import com.placement.mgt.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public JobDto createJob(JobDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Job job = Job.builder()
                .company(company)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .packageAmount(dto.getPackageAmount())
                .jobType(dto.getJobType())
                .location(dto.getLocation())
                .skillsRequired(dto.getSkillsRequired())
                .minCgpa(dto.getMinCgpa())
                .batchYear(dto.getBatchYear())
                .deadline(dto.getDeadline())
                .build();

        Job saved = jobRepository.save(job);
        return convertToDto(saved);
    }

    @Transactional
    public JobDto updateJob(Long id, JobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setPackageAmount(dto.getPackageAmount());
        job.setJobType(dto.getJobType());
        job.setLocation(dto.getLocation());
        job.setSkillsRequired(dto.getSkillsRequired());
        job.setMinCgpa(dto.getMinCgpa());
        job.setBatchYear(dto.getBatchYear());
        job.setDeadline(dto.getDeadline());

        Job updated = jobRepository.save(job);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found");
        }
        jobRepository.deleteById(id);
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return convertToDto(job);
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> getEligibleJobsForStudent(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        BigDecimal studentCgpa = student.getCgpa();
        Integer passingYear = student.getPassingYear();

        if (studentCgpa == null || passingYear == null) {
            // Student hasn't completed their profile yet
            return List.of();
        }

        return jobRepository.findEligibleJobs(studentCgpa, passingYear).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> searchJobs(String query) {
        if (query == null || query.isBlank()) {
            return getAllJobs();
        }
        return jobRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCaseOrSkillsRequiredContainingIgnoreCase(
                query, query, query
        ).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private JobDto convertToDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getCompanyName())
                .title(job.getTitle())
                .description(job.getDescription())
                .packageAmount(job.getPackageAmount())
                .jobType(job.getJobType())
                .location(job.getLocation())
                .skillsRequired(job.getSkillsRequired())
                .minCgpa(job.getMinCgpa())
                .batchYear(job.getBatchYear())
                .deadline(job.getDeadline())
                .build();
    }
}