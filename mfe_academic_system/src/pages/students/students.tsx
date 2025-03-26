import { useEffect, useState } from "react";
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from "@mui/material";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../../services/student.service";
import { IStudent } from "./interfaces/student.interface";

const Students = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);

  const [formData, setFormData] = useState<Omit<IStudent, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    document: "",
    phone: "",
    birthDate: "",
    createdBy: "admin",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error("La respuesta no es una lista:", data);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  const handleOpen = (student?: IStudent) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        ...student,
        birthDate: student.birthDate.split("T")[0], // ajusta para input type="date"
      });
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        document: "",
        phone: "",
        birthDate: "",
        createdBy: "admin",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
        updatedBy: "admin",
      };

      if (editingStudent && editingStudent.id) {
        await updateStudent(editingStudent.id, payload);
      } else {
        await createStudent(payload);
      }

      fetchStudents();
      handleClose();
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>Estudiantes</Typography>

      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpen()}>
        Agregar Estudiante
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName} {student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.document}</TableCell>
                <TableCell>{student.phone || "N/A"}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(student)}>Editar</Button>
                  <Button color="error" onClick={() => handleDelete(student.id!)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay estudiantes registrados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Crear / Editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingStudent ? "Editar Estudiante" : "Agregar Estudiante"}</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Documento" name="document" value={formData.document} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
          <TextField
            label="Fecha de nacimiento"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
