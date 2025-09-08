import type { Metadata } from 'next';
import { Container, Box } from '@mui/material';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from '../components/Header';
import './globals.css';

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
      <body className="bg-primary text-textPrimary font-sans">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-primary">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-8">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>

            <Box
              component="footer"
              sx={{
                backgroundColor: '#f5f5f5',
                py: 2,
                mt: 'auto',
                textAlign: 'center'
              }}
            >
              <div className="text-sm text-textSecondary">
                © 2024 Banorte. Todos los derechos reservados.
              </div>
            </Box>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
