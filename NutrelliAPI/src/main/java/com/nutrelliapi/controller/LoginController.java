package com.nutrelliapi.controller;

import com.nutrelliapi.dto.EmployeeDTO;
import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.security.JwtTokenFilter;
import com.nutrelliapi.service.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400);
            cookie.setAttribute("SameSite", "None");
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
}
