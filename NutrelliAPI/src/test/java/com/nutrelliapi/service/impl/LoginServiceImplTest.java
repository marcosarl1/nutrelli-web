package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.EmployeeNotFoundException;
import com.nutrelliapi.model.Employee;
import com.nutrelliapi.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private LoginServiceImpl loginService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAuthLoginSuccess() {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");
        employee.setPassword("password");
        when(employeeRepository.findEmployeeByEmail("test@example.com")).thenReturn(employee);

        Employee result = loginService.authLogin("test@example.com", "password");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(employeeRepository, times(1)).findEmployeeByEmail("test@example.com");
    }

    @Test
    void testAuthLoginInvalidCredentials() {
        when(employeeRepository.findEmployeeByEmail("test@example.com")).thenReturn(null);

        assertThrows(EmployeeNotFoundException.class, () -> loginService.authLogin("test@example.com", "password"));
    }

    @Test
    void testAuthLoginWrongPassword() {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");
        employee.setPassword("password");
        when(employeeRepository.findEmployeeByEmail("test@example.com")).thenReturn(employee);

        assertThrows(EmployeeNotFoundException.class, () -> loginService.authLogin("test@example.com", "wrongpassword"));
    }

    @Test
    void testFindByEmailSuccess() {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");
        when(employeeRepository.findEmployeeByEmail("test@example.com")).thenReturn(employee);

        Employee result = loginService.findByEmail("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(employeeRepository, times(1)).findEmployeeByEmail("test@example.com");
    }

    @Test
    void testFindByEmailNotFound() {
        when(employeeRepository.findEmployeeByEmail("test@example.com")).thenReturn(null);

        assertThrows(EmployeeNotFoundException.class, () -> loginService.findByEmail("test@example.com"));
    }
}