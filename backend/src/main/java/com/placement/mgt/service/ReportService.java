package com.placement.mgt.service;

import com.placement.mgt.dto.DashboardStatsDto;
import com.placement.mgt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalRecruiters = recruiterRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        // Calculate placement percentage
        // Total verified students
        long verifiedStudentsCount = studentRepository.findByIsVerified(true).size();
        
        // Count unique students who have status 'SELECTED'
        long placedStudentsCount = studentRepository.findAll().stream()
                .filter(student -> student.getIsVerified())
                .filter(student -> applicationRepository.findByStudentId(student.getId()).stream()
                        .anyMatch(app -> "SELECTED".equalsIgnoreCase(app.getStatus())))
                .count();

        double placementPercentage = 0.0;
        if (verifiedStudentsCount > 0) {
            placementPercentage = ((double) placedStudentsCount / verifiedStudentsCount) * 100.0;
            // Round to 2 decimal places
            placementPercentage = Math.round(placementPercentage * 100.0) / 100.0;
        }

        // Package stats
        Map<String, Object> pkgStats = applicationRepository.getSelectedPackageStatistics();
        BigDecimal maxPackage = BigDecimal.ZERO;
        BigDecimal minPackage = BigDecimal.ZERO;
        BigDecimal avgPackage = BigDecimal.ZERO;

        if (pkgStats != null) {
            if (pkgStats.get("maxPackage") != null) {
                maxPackage = new BigDecimal(pkgStats.get("maxPackage").toString());
            }
            if (pkgStats.get("minPackage") != null) {
                minPackage = new BigDecimal(pkgStats.get("minPackage").toString());
            }
            if (pkgStats.get("avgPackage") != null) {
                avgPackage = new BigDecimal(pkgStats.get("avgPackage").toString()).setScale(2, java.math.RoundingMode.HALF_UP);
            }
        }

        // Charts data
        List<Map<String, Object>> branchWise = applicationRepository.getBranchWisePlacements();
        List<Map<String, Object>> companyWise = applicationRepository.getCompanyWiseHires();
        List<Map<String, Object>> monthlyTrend = applicationRepository.getMonthlyPlacementTrends();

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalCompanies(totalCompanies)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .placementPercentage(placementPercentage)
                .maxPackage(maxPackage)
                .minPackage(minPackage)
                .avgPackage(avgPackage)
                .branchWisePlacement(branchWise)
                .companyWiseHiring(companyWise)
                .monthlyPlacementTrend(monthlyTrend)
                .build();
    }
}
