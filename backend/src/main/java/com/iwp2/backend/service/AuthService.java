package com.iwp2.backend.service;

import com.iwp2.backend.entity.*;
import com.iwp2.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(String name, String email, String rawPassword, String roleName) {

    	Role role = roleRepository.findByName(roleName)
            	.orElseThrow(() -> new RuntimeException("Role not found"));

    	User user = new User();
    	user.setName(name);
    	user.setEmail(email);
    	user.setPassword(passwordEncoder.encode(rawPassword));
    	user.setRole(role);

    	userRepository.save(user);
	}
}