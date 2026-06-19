package com.placement.mgt.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "package_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal packageAmount;

    @Column(name = "job_type", nullable = false, length = 50)
    private String jobType;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "skills_required", nullable = false, columnDefinition = "TEXT")
    private String skillsRequired;

    @Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal minCgpa;

    @Column(name = "batch_year", nullable = false)
    private Integer batchYear;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
