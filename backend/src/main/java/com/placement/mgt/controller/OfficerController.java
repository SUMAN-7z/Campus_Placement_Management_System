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
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
@RequiredArgsConstructor
public class OfficerController {

    private final ProfileService profileService;
    private final PlacementDriveService driveService;
    private final ReportService reportService;
    private final ApplicationService applicationService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfileDto>> getAllStudents() {
        return ResponseEntity.ok(profileService.getAllStudents());
    }

    @PutMapping("/students/{id}/verify")
    public ResponseEntity<Map<String, String>> verifyStudent(
            @PathVariable Long id, 
            @RequestParam Boolean status
    ) {
        profileService.verifyStudent(id, status);
        return ResponseEntity.ok(Map.of("message", "Student verification status updated successfully"));
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(profileService.getAllCompanies());
    }

    @PutMapping("/companies/{id}/approve")
    public ResponseEntity<Map<String, String>> approveCompany(
            @PathVariable Long id, 
            @RequestParam Boolean status
    ) {
        profileService.verifyCompany(id, status);
        return ResponseEntity.ok(Map.of("message", "Company approval status updated successfully"));
    }

    @PostMapping("/drives")
    public ResponseEntity<PlacementDriveDto> createDrive(@RequestBody PlacementDriveDto dto) {
        return ResponseEntity.ok(driveService.createDrive(dto));
    }

    @PutMapping("/drives/{id}")
    public ResponseEntity<PlacementDriveDto> updateDrive(
            @PathVariable Long id, 
            @RequestBody PlacementDriveDto dto
    ) {
        return ResponseEntity.ok(driveService.updateDrive(id, dto));
    }

    @DeleteMapping("/drives/{id}")
    public ResponseEntity<Map<String, String>> deleteDrive(@PathVariable Long id) {
        driveService.deleteDrive(id);
        return ResponseEntity.ok(Map.of("message", "Drive deleted successfully"));
    }

    @GetMapping("/drives")
    public ResponseEntity<List<PlacementDriveDto>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @PostMapping("/drives/{id}/results")
    public ResponseEntity<Map<String, String>> publishResults(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload
    ) {
        String results = payload.get("results");
        driveService.publishResults(id, results);
        return ResponseEntity.ok(Map.of("message", "Placement drive results published successfully"));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }
}
