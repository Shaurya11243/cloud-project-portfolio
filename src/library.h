#ifndef LIBRARY_H
#define LIBRARY_H

#include <string>
#include <vector>

class Employee {
public:
    Employee(const std::string& name, double salary);

    std::string getName() const;
    double getSalary() const;

private:
    std::string name;
    double salary;
};

class EmployeeManager {
public:
    void addEmployee(const Employee& employee);
    int getEmployeeCount() const;
    const Employee* findEmployee(const std::string& name) const;

private:
    std::vector<Employee> employees;
};

#endif // LIBRARY_H

