import { render, screen, waitFor } from "@testing-library/react";
import Students from "../students/students";
import * as studentService from "../../services/student.service";
import userEvent from "@testing-library/user-event";

jest.mock("../../services/student.service");

const mockStudents = [
  {
    id: "1",
    firstName: "Laura",
    lastName: "Ramírez",
    email: "laura@example.com",
    document: "123456789",
    phone: "3101234567",
    birthDate: "2000-06-15T00:00:00.000Z",
    createdBy: "admin",
  },
];

describe("Students Component", () => {
  beforeEach(() => {
    (studentService.getStudents as jest.Mock).mockResolvedValue(mockStudents);
  });

  it("debería renderizar el componente y mostrar estudiantes", async () => {
    render(<Students />);
    expect(await screen.findByText(/Laura Ramírez/i)).toBeInTheDocument();
    expect(screen.getByText(/laura@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agregar Estudiante/i })).toBeInTheDocument();
  });

  it("debería abrir el modal al hacer clic en 'Agregar Estudiante'", async () => {
    render(<Students />);
    const button = await screen.findByRole("button", { name: /Agregar Estudiante/i });
    userEvent.click(button);
    expect(await screen.findByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
  });

  it("debería mostrar error al fallar la creación", async () => {
    (studentService.createStudent as jest.Mock).mockRejectedValue({
      response: { data: { message: "Error al crear estudiante" } },
    });

    render(<Students />);
    userEvent.click(await screen.findByRole("button", { name: /Agregar Estudiante/i }));

    userEvent.type(screen.getByLabelText(/Nombre/i), "Pedro");
    userEvent.type(screen.getByLabelText(/Apellido/i), "Gómez");
    userEvent.type(screen.getByLabelText(/Email/i), "pedro@example.com");
    userEvent.type(screen.getByLabelText(/Documento/i), "1111111");
    userEvent.type(screen.getByLabelText(/Teléfono/i), "3000000000");
    userEvent.type(screen.getByLabelText(/Fecha de nacimiento/i), "2001-05-05");

    userEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error al crear estudiante/i)).toBeInTheDocument();
    });
  });

  it("debería ejecutar la eliminación del estudiante", async () => {
    (studentService.deleteStudent as jest.Mock).mockResolvedValue({});
    render(<Students />);
    const deleteBtn = await screen.findByRole("button", { name: /Eliminar/i });
    userEvent.click(deleteBtn);
    await waitFor(() => {
      expect(studentService.deleteStudent).toHaveBeenCalledWith("1");
    });
  });
});
