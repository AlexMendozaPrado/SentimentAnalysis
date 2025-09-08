'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { AnalyzePage } from './components/AnalyzePage';
import { HistoryPage } from './components/HistoryPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Análisis de Sentimientos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Analiza documentos PDF para obtener insights sobre el sentimiento y emociones de tus clientes
        </Typography>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Carga Documentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sube archivos PDF para análisis automático
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Análisis IA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Powered by OpenAI GPT-4 para máxima precisión
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Métricas Detalladas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sentimientos, emociones y métricas de texto
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <HistoryIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Historial
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consulta y exporta análisis previos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="navigation tabs">
            <Tab 
              label="Analizar Documento" 
              icon={<UploadIcon />} 
              iconPosition="start"
              id="simple-tab-0"
              aria-controls="simple-tabpanel-0"
            />
            <Tab 
              label="Historial de Análisis" 
              icon={<HistoryIcon />} 
              iconPosition="start"
              id="simple-tab-1"
              aria-controls="simple-tabpanel-1"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <AnalyzePage />
      </TabPanel>
      
      <TabPanel value={currentTab} index={1}>
        <HistoryPage />
      </TabPanel>
    </Container>
  );
}
