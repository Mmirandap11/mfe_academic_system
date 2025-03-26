import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./assets/theme/theme";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
