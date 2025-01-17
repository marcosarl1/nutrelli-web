package com.nutrelliapi.service;

import com.nutrelliapi.model.Employee;

public interface LoginService {
    Employee authLogin(String email, String password);
    Employee findByEmail(String email);
}
