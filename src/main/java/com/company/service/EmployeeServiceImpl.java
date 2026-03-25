package com.company.service;

import com.company.exception.ResourceNotFoundException;
import com.company.model.Employee;
import com.company.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employee> getAll() {
        return repository.findAll();
    }

    @Override
    public Employee getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public Employee create(Employee employee) {
        if (repository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + employee.getEmail());
        }
        return repository.save(employee);
    }

    @Override
    public Employee update(Long id, Employee updated) {
        Employee existing = getById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setDepartment(updated.getDepartment());
        existing.setSalary(updated.getSalary());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        repository.delete(getById(id));
    }

    @Override
    public List<Employee> getByDepartment(String department) {
        return repository.findByDepartment(department);
    }

    @Override
    public List<Employee> getBySalaryAbove(BigDecimal threshold) {
        return repository.findBySalaryGreaterThan(threshold);
    }
}
