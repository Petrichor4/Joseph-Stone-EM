class Role {
  title: string;
  salary: number;
  department_id: number | null;
  constructor(
    title: string,
    salary: number,
    department_id: number | null
  ) {
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }
}

export default Role;
