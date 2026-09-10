package com.skillnet.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrRegisterDto {
    private String name;
    private String email;
    private String password;
    private String companyName;
    private String location;
}
