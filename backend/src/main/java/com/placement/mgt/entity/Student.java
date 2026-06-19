package com.placement.mgt.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 10)
    private String gender;

    private LocalDate dob;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String branch;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(columnDefinition = "TEXT")
    private String internships;

    @Column(length = 150)
    private String linkedin;

    @Column(length = 150)
    private String github;

    @Column(name = "resume_path", length = 255)
    private String resumePath;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}