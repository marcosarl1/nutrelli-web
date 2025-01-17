package com.nutrelliapi.controller;

import com.nutrelliapi.dto.EmployeeDTO;
import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.security.JwtTokenFilter;
import com.nutrelliapi.service.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
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

            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Sem protocolo https no momento
            cookie.setPath("/");
            cookie.setMaxAge(86400);
            cookie.setAttribute("SameSite", "Strict");
            response.addCookie(cookie);

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

    @PostMapping("/auth")
    public ResponseEntity<?> auth(HttpServletRequest request) {
        String token = JwtTokenFilter.extractToken(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("WWW-Authenticate", "Bearer realm=\"access\"")
                    .body(Map.of("valid", false, "message", "Token não encontrado"));
        }

        if (JwtTokenFilter.validateToken(token)) {
            Authentication auth = JwtTokenFilter.getAuth(token);
            return ResponseEntity.ok(Map.of("valid", true, "email", auth.getName()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Token inválido"));
    }
}
