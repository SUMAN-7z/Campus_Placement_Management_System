package com.placement.mgt.service;

import com.placement.mgt.dto.CompanyDto;
import com.placement.mgt.dto.StudentProfileDto;
import com.placement.mgt.entity.Company;
import com.placement.mgt.entity.Student;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.CompanyRepository;
import com.placement.mgt.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public StudentProfileDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + userId));
        return convertToStudentDto(student);
    }

    public StudentProfileDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for ID: " + id));
        return convertToStudentDto(student);
    }

    public List<StudentProfileDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToStudentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentProfileDto updateStudentProfile(Long userId, StudentProfileDto dto) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        student.setName(dto.getName());
        student.setPhone(dto.getPhone());
        student.setGender(dto.getGender());
        student.setDob(dto.getDob());
        student.setAddress(dto.getAddress());
        student.setDepartment(dto.getDepartment());
        student.setBranch(dto.getBranch());
        student.setCgpa(dto.getCgpa());
        student.setPassingYear(dto.getPassingYear());
        student.setSkills(dto.getSkills());
        student.setProjects(dto.getProjects());
        student.setCertifications(dto.getCertifications());
        student.setInternships(dto.getInternships());
        student.setLinkedin(dto.getLinkedin());
        student.setGithub(dto.getGithub());

        Student updated = studentRepository.save(student);
        return convertToStudentDto(updated);
    }

    @Transactional
    public StudentProfileDto uploadResume(Long userId, MultipartFile file) throws IOException {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        // Generate filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String filename = student.getName().replaceAll("\\s+", "_") + "_" + UUID.randomUUID() + extension;
        Path filepath = Paths.get(uploadDir, filename);

        // Ensure directories exist
        Files.createDirectories(filepath.getParent());
        Files.copy(file.getInputStream(), filepath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        // Save resume relative endpoint URL
        String resumeUrl = "/uploads/resumes/" + filename;
        student.setResumePath(resumeUrl);
        
        Student updated = studentRepository.save(student);
        return convertToStudentDto(updated);
    }

    @Transactional
    public void verifyStudent(Long studentId, Boolean status) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        student.setIsVerified(status);
        studentRepository.save(student);
    }

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::convertToCompanyDto)
                .collect(Collectors.toList());
    }

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return convertToCompanyDto(company);
    }

    @Transactional
    public CompanyDto updateCompanyProfile(Long id, CompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        company.setCompanyName(dto.getCompanyName());
        company.setIndustry(dto.getIndustry());
        company.setHrName(dto.getHrName());
        company.setPhone(dto.getPhone());
        company.setWebsite(dto.getWebsite());
        company.setAddress(dto.getAddress());
        company.setDescription(dto.getDescription());

        Company updated = companyRepository.save(company);
        return convertToCompanyDto(updated);
    }

    @Transactional
    public void verifyCompany(Long companyId, Boolean status) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        company.setIsApproved(status);
        companyRepository.save(company);
    }

    private StudentProfileDto convertToStudentDto(Student student) {
        return StudentProfileDto.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .email(student.getUser().getEmail())
                .name(student.getName())
                .phone(student.getPhone())
                .gender(student.getGender())
                .dob(student.getDob())
                .address(student.getAddress())
                .department(student.getDepartment())
                .branch(student.getBranch())
                .cgpa(student.getCgpa())
                .passingYear(student.getPassingYear())
                .skills(student.getSkills())
                .projects(student.getProjects())
                .certifications(student.getCertifications())
                .internships(student.getInternships())
                .linkedin(student.getLinkedin())
                .github(student.getGithub())
                .resumePath(student.getResumePath())
                .isVerified(student.getIsVerified())
                .build();
    }

    private CompanyDto convertToCompanyDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .industry(company.getIndustry())
                .hrName(company.getHrName())
                .email(company.getEmail())
                .phone(company.getPhone())
                .website(company.getWebsite())
                .address(company.getAddress())
                .description(company.getDescription())
                .isApproved(company.getIsApproved())
                .build();
    }
}
