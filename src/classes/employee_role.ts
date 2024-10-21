class Role {
  id: number;
  title: string;
  salary: number;
  department_id: number | null;
  constructor(
    id: number,
    title: string,
    salary: number,
    department_id: number | null
  ) {
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }
}

export default Role;
