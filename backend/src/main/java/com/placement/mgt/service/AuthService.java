package com.placement.mgt.service;

import com.placement.mgt.dto.*;
import com.placement.mgt.entity.*;
import com.placement.mgt.exception.BadRequestException;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.*;
import com.placement.mgt.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Fetch Role
        String roleName = "ROLE_" + request.getRole().toUpperCase();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        // Create User
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Perform Role-specific profile initialization
        Long companyId = null;
        Boolean isApproved = false;

        if (roleName.equals("ROLE_STUDENT")) {
            Student student = Student.builder()
                    .user(user)
                    .name(request.getName())
                    .phone(request.getPhone())
                    .isVerified(false)
                    .build();
            studentRepository.save(student);
        } else if (roleName.equals("ROLE_RECRUITER")) {
            Company company;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                Optional<Company> existingCompany = companyRepository.findByCompanyName(request.getCompanyName());
                if (existingCompany.isPresent()) {
                    company = existingCompany.get();
                } else {
                    company = Company.builder()
                            .companyName(request.getCompanyName())
                            .email(request.getEmail()) // HR email
                            .industry(request.getIndustry())
                            .website(request.getWebsite())
                            .isApproved(false) // Needs Admin approval
                            .build();
                    company = companyRepository.save(company);
                }
                companyId = company.getId();
                isApproved = company.getIsApproved();
            } else {
                throw new BadRequestException("Company name is required for Recruiter registration");
            }

            Recruiter recruiter = Recruiter.builder()
                    .user(user)
                    .company(company)
                    .name(request.getName())
                    .phone(request.getPhone())
                    .build();
            recruiterRepository.save(recruiter);
        } else if (roleName.equals("ROLE_OFFICER")) {
            // Officers are pre-approved
            isApproved = true;
        }

        // Generate Tokens
        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(role.getName())
                .name(request.getName())
                .isProfileCompleted(false)
                .isApproved(isApproved)
                .companyId(companyId)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        
        // Remove old refresh token if exists, and generate new one
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);
        RefreshToken refreshToken = createRefreshToken(user);

        // Fetch display name & approval status
        String name = "";
        Boolean isProfileCompleted = false;
        Boolean isApproved = false;
        Long companyId = null;

        if (user.getRole().getName().equals("ROLE_STUDENT")) {
            Optional<Student> student = studentRepository.findByUserId(user.getId());
            if (student.isPresent()) {
                name = student.get().getName();
                isProfileCompleted = student.get().getCgpa() != null;
                isApproved = student.get().getIsVerified();
            }
        } else if (user.getRole().getName().equals("ROLE_RECRUITER")) {
            Optional<Recruiter> recruiter = recruiterRepository.findByUserId(user.getId());
            if (recruiter.isPresent()) {
                name = recruiter.get().getName();
                isProfileCompleted = true;
                if (recruiter.get().getCompany() != null) {
                    companyId = recruiter.get().getCompany().getId();
                    isApproved = recruiter.get().getCompany().getIsApproved();
                }
            }
        } else {
            name = "Officer / Admin";
            isProfileCompleted = true;
            isApproved = true; // Admins and officers are approved
        }

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .name(name)
                .isProfileCompleted(isProfileCompleted)
                .isApproved(isApproved)
                .companyId(companyId)
                .build();
    }

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(604800000)) // 7 Days
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    return TokenRefreshResponse.builder()
                            .accessToken(token)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new BadRequestException("Refresh token is not in database!"));
    }

    @Transactional
    public void logout(String requestRefreshToken) {
        refreshTokenRepository.findByToken(requestRefreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        System.out.println("Mock password reset email sent to " + email);
    }
}
