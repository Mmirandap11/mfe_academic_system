import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Students from './pages/students/students';
import Enrollments from './pages/enrollments/enrollment';
// (más adelante: importar Subjects, Groups, Enrollments si los agregas)

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students" element={<Students />} />
      <Route path="/enrollments" element={<Enrollments />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
