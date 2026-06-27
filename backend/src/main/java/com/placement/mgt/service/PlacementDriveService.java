package com.placement.mgt.service;

import com.placement.mgt.dto.PlacementDriveDto;
import com.placement.mgt.entity.Company;
import com.placement.mgt.entity.PlacementDrive;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.CompanyRepository;
import com.placement.mgt.repository.PlacementDriveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final NotificationService notificationService;

    @Transactional
    public PlacementDriveDto createDrive(PlacementDriveDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        PlacementDrive drive = PlacementDrive.builder()
                .driveName(dto.getDriveName())
                .company(company)
                .date(dto.getDate())
                .time(dto.getTime())
                .venue(dto.getVenue())
                .eligibilityCriteria(dto.getEligibilityCriteria())
                .registrationDeadline(dto.getRegistrationDeadline())
                .status("UPCOMING")
                .build();

        PlacementDrive saved = driveRepository.save(drive);
        
        // Notify all users about new drive (or let notification system pick it up)
        notificationService.broadcastNotification(
                "New Placement Drive: " + drive.getDriveName(),
                "A placement drive by " + company.getCompanyName() + " has been scheduled on " + drive.getDate() + ". Register before " + drive.getRegistrationDeadline() + "!",
                "PLACEMENT_DRIVE"
        );

        return convertToDto(saved);
    }

    @Transactional
    public PlacementDriveDto updateDrive(Long id, PlacementDriveDto dto) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found"));

        drive.setDriveName(dto.getDriveName());
        drive.setDate(dto.getDate());
        drive.setTime(dto.getTime());
        drive.setVenue(dto.getVenue());
        drive.setEligibilityCriteria(dto.getEligibilityCriteria());
        drive.setRegistrationDeadline(dto.getRegistrationDeadline());
        drive.setStatus(dto.getStatus());

        PlacementDrive updated = driveRepository.save(drive);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteDrive(Long id) {
        if (!driveRepository.existsById(id)) {
            throw new ResourceNotFoundException("Drive not found");
        }
        driveRepository.deleteById(id);
    }

    public PlacementDriveDto getDriveById(Long id) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found"));
        return convertToDto(drive);
    }

    public List<PlacementDriveDto> getAllDrives() {
        return driveRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PlacementDriveDto> getDrivesByCompany(Long companyId) {
        return driveRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void publishResults(Long driveId, String results) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found"));
        
        drive.setStatus("COMPLETED");
        driveRepository.save(drive);

        // Notify students
        notificationService.broadcastNotification(
                "Placement Drive Results: " + drive.getDriveName(),
                "The hiring outcomes for the " + drive.getDriveName() + " placement drive are now published: " + results,
                "PLACEMENT_DRIVE"
        );
    }

    private PlacementDriveDto convertToDto(PlacementDrive drive) {
        return PlacementDriveDto.builder()
                .id(drive.getId())
                .driveName(drive.getDriveName())
                .companyId(drive.getCompany().getId())
                .companyName(drive.getCompany().getCompanyName())
                .date(drive.getDate())
                .time(drive.getTime())
                .venue(drive.getVenue())
                .eligibilityCriteria(drive.getEligibilityCriteria())
                .registrationDeadline(drive.getRegistrationDeadline())
                .status(drive.getStatus())
                .build();
    }
}
