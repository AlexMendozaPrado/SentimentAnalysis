import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Banorte - Análisis de Sentimientos',
  description: 'Plataforma de análisis de sentimientos para documentos PDF usando OpenAI GPT-4',
  keywords: 'banorte, análisis, sentimientos, pdf, openai, gpt-4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ backgroundColor: '#C8102E' }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Banorte - Análisis de Sentimientos
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </Container>
            
            <Box 
              component="footer" 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                py: 2, 
                mt: 'auto',
                textAlign: 'center' 
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © 2024 Banorte. Todos los derechos reservados.
              </Typography>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
