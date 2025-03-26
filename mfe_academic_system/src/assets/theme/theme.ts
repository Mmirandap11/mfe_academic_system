import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // azul MUI por defecto
    },
    secondary: {
      main: '#dc004e', // rojo MUI por defecto
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8, // bordes más redondeados
  },
});

export default theme;
