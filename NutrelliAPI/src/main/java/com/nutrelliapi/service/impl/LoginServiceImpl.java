package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.repository.EmployeeRepository;
import com.nutrelliapi.service.LoginService;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {

    private final EmployeeRepository employeeRepository;

    public LoginServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee authLogin (String email, String password) {
        Employee employeeToLogin = employeeRepository.findEmployeeByEmail(email);
        if (employeeToLogin == null) {
            throw new EmployeeNotFoundException("Funcionário com email: " + email + " não encontrado");
        }

        if (!password.trim().equals(employeeToLogin.getPassword().trim())) {
            throw new EmployeeNotFoundException("Senha incorreta");
        }

        return employeeToLogin;
    }
}
