package com.placement.mgt.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String email;
    private String name;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private String department;
    private String branch;
    private BigDecimal cgpa;
    private Integer passingYear;
    private String skills;
    private String projects;
    private String certifications;
    private String internships;
    private String linkedin;
    private String github;
    private String resumePath;
    private Boolean isVerified;
}
