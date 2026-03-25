package com.company.repository;

import com.company.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    // Derived query — Spring generates SQL from method name
    List<Employee> findByDepartment(String department);

    // JPQL query — employees earning above a given salary
    @Query("SELECT e FROM Employee e WHERE e.salary > :threshold")
    List<Employee> findBySalaryGreaterThan(@Param("threshold") BigDecimal threshold);
}
