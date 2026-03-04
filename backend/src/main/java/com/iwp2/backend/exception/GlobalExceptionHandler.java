package com.iwp2.backend.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(new ErrorResponse("Bad Request", ex.getMessage()));
	}

	static class ErrorResponse {
		private String error;
		private String message;

		public ErrorResponse(String error, String message) {
			this.error = error;
			this.message = message;
		}

		public String getError() {
			return error;
		}

		public String getMessage() {
			return message;
		}
	}
}