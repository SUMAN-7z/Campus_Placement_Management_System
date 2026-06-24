package com.placement.mgt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{6,}$", 
             message = "Password must be at least 6 characters and contain at least one letter and one number")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(STUDENT|RECRUITER|OFFICER)$", message = "Role must be STUDENT, RECRUITER, or OFFICER")
    private String role;

    @NotBlank(message = "Full name is required")
    private String name;

    private String phone;

    // Company Registration fields (Only for Recruiter role)
    private String companyName;
    private String industry;
    private String website;
}
