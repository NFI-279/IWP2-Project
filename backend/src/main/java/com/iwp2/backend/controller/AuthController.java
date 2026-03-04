package com.iwp2.backend.controller;

import com.iwp2.backend.dto.LoginRequest;
import com.iwp2.backend.dto.RegisterRequest;
import com.iwp2.backend.dto.UserResponse;
import com.iwp2.backend.entity.User;
import com.iwp2.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import com.iwp2.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;

	public AuthController(AuthService authService,
			AuthenticationManager authenticationManager,
			UserRepository userRepository) {

		this.authService = authService;
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
	}

	@PostMapping("/register")
	public String register(@RequestBody RegisterRequest request) {

		authService.register(
				request.getName(),
				request.getEmail(),
				request.getPassword(),
				request.getRole());

		return "User registered successfully";
	}

	@PostMapping("/login")
	public String login(@RequestBody LoginRequest request,
			HttpServletRequest httpRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		// IMPORTANT: store context in session
		HttpSession session = httpRequest.getSession(true);
		session.setAttribute(
				"SPRING_SECURITY_CONTEXT",
				SecurityContextHolder.getContext());

		return "Login successful";
	}

	@GetMapping("/me")
	public UserResponse me(Authentication authentication) {

		String email = authentication.getName();

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		return new UserResponse(user);
	}
}