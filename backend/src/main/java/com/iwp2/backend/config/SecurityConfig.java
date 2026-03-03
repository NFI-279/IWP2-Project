package com.iwp2.backend.config;

import com.iwp2.backend.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	private final CustomUserDetailsService userDetailsService;
	private final PasswordEncoder passwordEncoder;

	public SecurityConfig(CustomUserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {
		this.userDetailsService = userDetailsService;
		this.passwordEncoder = passwordEncoder;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http

				// Disable CSRF for API usage
				.csrf(csrf -> csrf.disable())

				// Session-based authentication
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

				// Authorization rules
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/auth/**", "/login").permitAll()
						.requestMatchers("/admin/**").hasRole("ADMIN")
						.requestMatchers("/teacher/**").hasRole("TEACHER")
						.anyRequest().authenticated())

				// Enable default session login (for now)
				.formLogin(form -> form.disable())

				// Disable HTTP Basic
				.httpBasic(httpBasic -> httpBasic.disable());

		return http.build();
	}

	// Needed for manual authentication later (JSON login)
	@Bean
	public AuthenticationManager authenticationManager(
			AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}