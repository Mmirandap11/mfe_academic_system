export interface IGroup {
    id: string;
    name: string;
    maxCapacity: number;
    subjectId: string;
    subject: {
      id: string;
      name: string;
    };
    createdBy: string;
    updatedBy: string;
    createdAt?: string;
    updatedAt?: string;
  }
  