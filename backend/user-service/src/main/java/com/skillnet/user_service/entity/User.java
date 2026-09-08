package com.skillnet.user_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String name;
    private String profession;
    private Integer yearsOfExperience;
    private String location;
    @Column(nullable = false)
    private boolean available = false;

    protected User() {
    }

    public User(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public String getName() { return name; }
    public String getProfession() { return profession; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public String getLocation() { return location; }
    public boolean isAvailable() { return available; }
    public void setName(String name) { this.name = name; }
    public void setProfession(String profession) { this.profession = profession; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public void setLocation(String location) { this.location = location; }
    public void setAvailable(boolean available) { this.available = available; }
}
