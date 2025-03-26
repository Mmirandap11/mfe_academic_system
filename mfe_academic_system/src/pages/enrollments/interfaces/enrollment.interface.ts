export interface IEnrollment {
    id: string;
    enrollmentDate: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
    group: {
      id: string;
      name: string;
      subject: {
        id: string;
        name: string;
      };
    };
  }
  