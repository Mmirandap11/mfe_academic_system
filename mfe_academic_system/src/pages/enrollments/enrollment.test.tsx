import { render, screen, waitFor,} from '@testing-library/react';
import Enrollments from './enrollment';
import * as enrollmentService from '../../services/enrollment.service';
import * as studentService from '../../services/student.service';
import * as groupService from '../../services/group.service';
import userEvent from '@testing-library/user-event';

jest.mock('../../services/enrollment.service');
jest.mock('../../services/student.service');
jest.mock('../../services/group.service');

const mockEnrollment = [
  {
    id: '1',
    enrollmentDate: new Date().toISOString(),
    student: { id: '1', firstName: 'Juan', lastName: 'Pérez' },
    group: { id: '1', name: 'Grupo A', subject: { id: '1', name: 'Matemáticas' } },
  },
];

const mockStudents = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', email: '', document: '', phone: '', birthDate: '', createdBy: '' }
];

const mockGroups = [
  { id: '1', name: 'Grupo A', subjectId: '1', subject: { id: '1', name: 'Matemáticas' }, maxCapacity: 10, createdBy: '', updatedBy: '' }
];

describe('Enrollments Component', () => {
  beforeEach(() => {
    (enrollmentService.getEnrollments as jest.Mock).mockResolvedValue(mockEnrollment);
    (studentService.getStudents as jest.Mock).mockResolvedValue(mockStudents);
    (groupService.getGroups as jest.Mock).mockResolvedValue(mockGroups);
  });

  it('debería renderizar el título y botón principal', async () => {
    render(<Enrollments />);
    expect(await screen.findByText(/Matrículas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nueva Matrícula/i })).toBeInTheDocument();
  });

  it('debería mostrar al menos una matrícula en la tabla', async () => {
    render(<Enrollments />);
    expect(await screen.findByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/Grupo A/i)).toBeInTheDocument();
    expect(screen.getByText(/Matemáticas/i)).toBeInTheDocument();
  });

  it('debería abrir el modal al hacer clic en "Nueva Matrícula"', async () => {
    render(<Enrollments />);
    const button = screen.getByRole('button', { name: /Nueva Matrícula/i });
    userEvent.click(button);
    expect(await screen.findByText(/Estudiante/i)).toBeInTheDocument();
  });

  it('debería mostrar un snackbar al fallar una matrícula', async () => {
    (enrollmentService.createEnrollment as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Group is full' } }
    });

    render(<Enrollments />);
    userEvent.click(screen.getByRole('button', { name: /Nueva Matrícula/i }));

    const selectStudent = await screen.findByLabelText(/Estudiante/i);
    userEvent.selectOptions(selectStudent, '1');

    const selectGroup = screen.getByLabelText(/Grupo/i);
    userEvent.selectOptions(selectGroup, '1');

    const guardarBtn = screen.getByRole('button', { name: /Guardar/i });
    userEvent.click(guardarBtn);

    expect(await screen.findByText(/Group is full/i)).toBeInTheDocument();
  });

  it('debería eliminar una matrícula', async () => {
    (enrollmentService.deleteEnrollment as jest.Mock).mockResolvedValue({});
    render(<Enrollments />);
    const deleteBtn = await screen.findByRole('button', { name: /Eliminar/i });
    userEvent.click(deleteBtn);
    await waitFor(() => {
      expect(enrollmentService.deleteEnrollment).toHaveBeenCalledWith('1');
    });
  });
});
