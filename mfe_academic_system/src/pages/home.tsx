import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido al Sistema Académico
      </Typography>
      <Typography variant="h6" gutterBottom>
        Selecciona una opción para comenzar:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
        <Button variant="contained" onClick={() => navigate("/students")}>
          Estudiantes
        </Button>
        <Button variant="outlined" onClick={() => navigate("/subjects")}>
          Asignaturas
        </Button>
        <Button variant="outlined" onClick={() => navigate("/groups")}>
          Grupos
        </Button>
        <Button variant="outlined" onClick={() => navigate("/enrollments")}>
          Matrículas
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
