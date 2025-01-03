package com.nutrelliapi.controller;

import com.nutrelliapi.dto.LoginDTO;
import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.service.LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("")
    public ResponseEntity<Employee> login(@RequestBody LoginDTO loginDTO) {
        try {
            Employee employee = loginService.authLogin(loginDTO.getEmail(), loginDTO.getPassword());
            System.out.println(employee);
            return ResponseEntity.ok(employee);
        } catch (EmployeeNotFoundException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
