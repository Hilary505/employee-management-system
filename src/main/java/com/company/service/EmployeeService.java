package com.company.service;

import com.company.model.Employee;

import java.math.BigDecimal;
import java.util.List;

public interface EmployeeService {

    List<Employee> getAll();

    Employee getById(Long id);

    Employee create(Employee employee);

    Employee update(Long id, Employee employee);

    void delete(Long id);

    List<Employee> getByDepartment(String department);

    List<Employee> getBySalaryAbove(BigDecimal threshold);
}
