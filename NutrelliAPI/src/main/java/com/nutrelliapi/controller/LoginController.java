package com.nutrelliapi.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.nutrelliapi.dto.EmployeeDTO;
import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.security.JwtTokenFilter;
import com.nutrelliapi.service.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EmployeeDTO employeeDTO, HttpServletResponse response) {
        try {
            Employee employee = loginService.authLogin(employeeDTO.getEmail(), employeeDTO.getPassword());
            String token = JwtTokenFilter.generateToken(employeeDTO.getEmail());

            ResponseCookie cookie = ResponseCookie.from("jwt_token", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .partitioned(true)
                    .maxAge(86400)
                    .sameSite("None")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            Map<String, Object> res = new HashMap<>();
            res.put("token", token);
            res.put("employee", employee);
            return ResponseEntity.ok(res);
        } catch (EmployeeNotFoundException ex) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("message", ex.getMessage());
            errorRes.put("status", HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorRes);
        }
    }

    @PostMapping("/auth/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        boolean isValid = JwtTokenFilter.validateToken(token);

        if (isValid) {
            DecodedJWT decodedJWT = JWT.decode(token);
            String email = decodedJWT.getSubject();

            Map<String, Object> res = new HashMap<>();
            res.put("valid", true);
            res.put("email", email);
            return ResponseEntity.ok(res);
        } else {
            Map<String, Object> res = new HashMap<>();
            res.put("valid", false);
            res.put("message", "Token inválido ou expirado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        }
    }
}
