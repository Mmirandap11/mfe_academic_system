import { useEffect, useState } from "react";
import {
  Container, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Alert
} from "@mui/material";

import { getEnrollments, createEnrollment, deleteEnrollment } from "../../services/enrollment.service";
import { getStudents } from "../../services/student.service";
import { getGroups } from "../../services/group.service";
import { IStudent } from "../students/interfaces/student.interface";
import { IGroup } from "../groups/interface/group.interface";
import { IEnrollment } from "./interfaces/enrollment.interface";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    groupId: "",
    createdBy: "admin",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [e, s, g] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getGroups(),
      ]);

      if (Array.isArray(e)) {
        setEnrollments(e);
      } else {
        console.error("Respuesta inesperada de getEnrollments:", e);
        setEnrollments([]);
      }

      setStudents(s);
      setGroups(g);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createEnrollment(form);
      await loadData();
      setSnackbar({ open: true, message: "Matrícula registrada", severity: "success" });
      setOpen(false);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Error al registrar matrícula";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEnrollment(id);
      await loadData();
      setSnackbar({ open: true, message: "Matrícula eliminada", severity: "success" });
    } catch (error) {
      console.error("Error eliminando matrícula:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>Matrículas</Typography>

      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        Nueva Matrícula
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Asignatura</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(enrollments) && enrollments.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.student.firstName} {e.student.lastName}</TableCell>
                <TableCell>{e.group.name}</TableCell>
                <TableCell>{e.group.subject.name}</TableCell>
                <TableCell>{new Date(e.enrollmentDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(e.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
            {enrollments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay matrículas registradas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nueva Matrícula</DialogTitle>
        <DialogContent>
          <TextField
            select
            name="studentId"
            label="Estudiante"
            value={form.studentId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.firstName} {s.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            name="groupId"
            label="Grupo"
            value={form.groupId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name} - {g.subject.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Enrollments;
