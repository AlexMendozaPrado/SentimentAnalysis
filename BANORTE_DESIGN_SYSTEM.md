# Guía de Implementación del Sistema de Diseño Banorte

## Introducción

Esta guía proporciona una implementación completa del sistema de diseño oficial de Banorte para aplicaciones React + Next.js + Material-UI, basada en la **Guía de Estilos Web Banorte Versión 1**.

## Tabla de Contenidos

1. [Instalación y Configuración](#instalación-y-configuración)
2. [Configuración del Tema](#configuración-del-tema)
3. [Componentes Principales](#componentes-principales)
4. [Implementación en el Proyecto](#implementación-en-el-proyecto)
5. [Lista de Verificación para Migración](#lista-de-verificación-para-migración)
6. [Especificaciones Técnicas](#especificaciones-técnicas)

## Instalación y Configuración

### Dependencias Requeridas

```bash
# Core dependencies
npm install @mui/material@5.15.1 @emotion/react@11.11.1 @emotion/styled@11.11.0
npm install @mui/icons-material@5.14.19
npm install react@18.2.0 react-dom@18.2.0
npm install next@14.0.4

# Tipos para TypeScript
npm install --save-dev @types/react@18.2.45 @types/react-dom@18.2.18
npm install --save-dev typescript@5.3.3
```

### Estructura de Archivos

```
src/
├── theme/
│   └── banorte.theme.ts
├── components/
│   ├── ui/
│   │   ├── BanorteButton.tsx
│   │   ├── BanorteTextField.tsx
│   │   └── BanorteModal.tsx
│   └── layout/
│       └── BanorteHeader.tsx
└── hooks/
    └── useBanorteTheme.ts
```

## Configuración del Tema

### Archivo: `src/theme/banorte.theme.ts`

```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Colores oficiales de Banorte
const banorteColors = {
  primary: '#EB0029',        // Banorte Red
  primaryHover: '#E30028',   // Banorte Red Hover
  primaryLight: '#EBF0F2',   // Light Primary
  surface1: '#FFFFFF',       // Surface 1
  surface2: '#F8F9FA',       // Surface 2
  textPrimary: '#323E48',    // Dark Gray
  textSecondary: '#5B6670',  // Medium Gray
  textDisabled: '#7B868C',   // Light Gray
  success: '#6CC04A',        // Green
  warning: '#FFA400',        // Orange
  error: '#FF671B',          // Error Orange
  borderDashed: '#D1D5DB',   // Dashed Border
  borderLight: '#E5E7EB',    // Light Border
};

// Configuración de tipografía
const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Gotham',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),

  // Headers y elementos de UI usan Gotham
  h1: {
    fontFamily: 'Gotham',
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    color: banorteColors.textPrimary,
  },
  h2: {
    fontFamily: 'Gotham',
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    color: banorteColors.textPrimary,
  },
  h3: {
    fontFamily: 'Gotham',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    color: banorteColors.textPrimary,
  },
  h4: {
    fontFamily: 'Gotham',
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    color: banorteColors.textPrimary,
  },

  // Contenido usa Roboto
  body1: {
    fontFamily: 'Roboto',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: banorteColors.textSecondary,
  },
  body2: {
    fontFamily: 'Roboto',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: banorteColors.textSecondary,
  },

  // Botones usan Gotham
  button: {
    fontFamily: 'Gotham',
    fontWeight: 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
};

// Tema principal de Banorte
export const banorteTheme = createTheme({
  palette: {
    primary: {
      main: banorteColors.primary,
      dark: banorteColors.primaryHover,
      light: banorteColors.primaryLight,
      contrastText: banorteColors.surface1,
    },
    secondary: {
      main: banorteColors.textPrimary,
      light: banorteColors.textSecondary,
      dark: banorteColors.textPrimary,
      contrastText: banorteColors.surface1,
    },
    success: {
      main: banorteColors.success,
    },
    warning: {
      main: banorteColors.warning,
    },
    error: {
      main: banorteColors.error,
    },
    background: {
      default: banorteColors.surface2,
      paper: banorteColors.surface1,
    },
    text: {
      primary: banorteColors.textPrimary,
      secondary: banorteColors.textSecondary,
      disabled: banorteColors.textDisabled,
    },
    divider: banorteColors.borderLight,
  },

  typography,

  shape: {
    borderRadius: 4, // Especificación oficial: 4px
  },

  spacing: 8, // Sistema de spacing basado en múltiplos de 8px

  components: {
    // Configuración global de botones
    MuiButton: {
      styleOverrides: {
        root: {
          height: '45px', // Altura oficial para botones primarios
          borderRadius: '4px',
          fontFamily: 'Gotham',
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: banorteColors.primary,
          color: banorteColors.surface1,
          '&:hover': {
            backgroundColor: banorteColors.primaryHover,
          },
          '&:disabled': {
            backgroundColor: banorteColors.textDisabled,
            color: banorteColors.surface1,
          },
        },
        outlinedPrimary: {
          borderColor: banorteColors.primary,
          color: banorteColors.primary,
          '&:hover': {
            borderColor: banorteColors.primaryHover,
            backgroundColor: 'rgba(235, 0, 41, 0.04)',
          },
        },
      },
    },

    // Configuración de campos de texto
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            '& fieldset': {
              borderColor: banorteColors.borderLight,
            },
            '&:hover fieldset': {
              borderColor: banorteColors.textSecondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: banorteColors.primary,
            },
          },
          '& .MuiInputLabel-root': {
            color: banorteColors.textSecondary,
            fontFamily: 'Roboto',
            '&.Mui-focused': {
              color: banorteColors.primary,
            },
          },
        },
      },
    },

    // Configuración de modales
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px', // Modales usan 8px según especificación
          maxWidth: '720px',   // Ancho oficial para modales
          minHeight: '320px',  // Altura mínima oficial
          padding: '32px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },

    // Headers y navegación
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: banorteColors.surface1,
          color: banorteColors.textPrimary,
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
          height: '64px',
        },
      },
    },
  },
});

export default banorteTheme;
```

## Componentes Principales

### 1. BanorteButton

```typescript
// src/components/ui/BanorteButton.tsx
import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface BanorteButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  fullWidth?: boolean;
}

const StyledBanorteButton = styled(Button)<BanorteButtonProps>(({ theme, variant }) => ({
  height: '45px',
  borderRadius: '4px',
  fontFamily: 'Gotham',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '12px 24px',

  ...(variant === 'primary' && {
    backgroundColor: '#EB0029',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#E30028',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    '&:disabled': {
      backgroundColor: '#7B868C',
      color: '#FFFFFF',
    },
  }),

  ...(variant === 'secondary' && {
    backgroundColor: '#323E48',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#5B6670',
    },
  }),

  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    border: '1px solid #EB0029',
    color: '#EB0029',
    '&:hover': {
      backgroundColor: 'rgba(235, 0, 41, 0.04)',
      borderColor: '#E30028',
    },
  }),

  ...(variant === 'text' && {
    backgroundColor: 'transparent',
    color: '#EB0029',
    '&:hover': {
      backgroundColor: 'rgba(235, 0, 41, 0.04)',
    },
  }),
}));

export const BanorteButton: React.FC<BanorteButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledBanorteButton
      variant={variant as any}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={20}
          sx={{
            color: variant === 'primary' ? '#FFFFFF' : '#EB0029',
            marginRight: 1
          }}
        />
      ) : null}
      {children}
    </StyledBanorteButton>
  );
};
```

### 2. BanorteTextField

```typescript
// src/components/ui/BanorteTextField.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBanorteTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E5E7EB',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#5B6670',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EB0029',
      borderWidth: '2px',
    },
    '& input': {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      color: '#323E48',
      padding: '12px 16px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#5B6670',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    '&.Mui-focused': {
      color: '#EB0029',
    },
    '&.Mui-error': {
      color: '#FF671B',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Roboto',
    fontSize: '0.75rem',
    marginTop: '4px',
    '&.Mui-error': {
      color: '#FF671B',
    },
  },
}));

export const BanorteTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <StyledBanorteTextField
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};
```

### 3. BanorteModal

```typescript
// src/components/ui/BanorteModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface BanorteModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '8px',
    maxWidth: '720px',
    minHeight: '320px',
    padding: '32px',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    margin: '32px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: 0,
  marginBottom: '24px',
  fontFamily: 'Gotham',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#323E48',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  marginBottom: '24px',
  fontFamily: 'Roboto',
  fontSize: '1rem',
  lineHeight: 1.6,
  color: '#5B6670',
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: 0,
  gap: '12px',
  justifyContent: 'flex-end',
}));

export const BanorteModal: React.FC<BanorteModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      {title && (
        <StyledDialogTitle>
          {title}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#5B6670' }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
      )}

      <StyledDialogContent>
        {children}
      </StyledDialogContent>

      {actions && (
        <StyledDialogActions>
          {actions}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};
```

### 4. BanorteHeader

```typescript
// src/components/layout/BanorteHeader.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#323E48',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
  height: '64px',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: '64px',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

const BanorteLogo = styled('div')(({ theme }) => ({
  width: '120px',
  height: '32px',
  backgroundColor: '#EB0029',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  color: '#FFFFFF',
  fontFamily: 'Gotham',
  fontWeight: 700,
  fontSize: '1rem',
}));

interface BanorteHeaderProps {
  title?: string;
  user?: {
    name: string;
    email?: string;
  };
  onMenuClick?: () => void;
  onUserMenuClick?: () => void;
}

export const BanorteHeader: React.FC<BanorteHeaderProps> = ({
  title,
  user,
  onMenuClick,
  onUserMenuClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <LogoSection>
          {onMenuClick && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMenuClick}
              sx={{ marginRight: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <BanorteLogo>
            BANORTE
          </BanorteLogo>

          {title && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: 'Gotham',
                fontWeight: 500,
                color: '#323E48',
              }}
            >
              {title}
            </Typography>
          )}
        </LogoSection>

        {user && (
          <Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Typography sx={{ fontFamily: 'Roboto' }}>
                  {user.name}
                </Typography>
              </MenuItem>
              {user.email && (
                <MenuItem onClick={handleClose}>
                  <Typography sx={{ fontFamily: 'Roboto', fontSize: '0.875rem', color: '#5B6670' }}>
                    {user.email}
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleClose}>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};
```

## Implementación en el Proyecto

### 1. Configurar el Theme Provider

```typescript
// _app.tsx o layout principal
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { banorteTheme } from '../theme/banorte.theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={banorteTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

### 2. Hook para usar el tema

```typescript
// src/hooks/useBanorteTheme.ts
import { useTheme } from '@mui/material/styles';

export const useBanorteTheme = () => {
  const theme = useTheme();

  return {
    colors: {
      primary: theme.palette.primary.main,
      primaryHover: theme.palette.primary.dark,
      textPrimary: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
      surface1: theme.palette.background.paper,
      surface2: theme.palette.background.default,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
    },
    spacing: theme.spacing,
    borderRadius: theme.shape.borderRadius,
  };
};
```

### 3. Ejemplo de uso

```typescript
// pages/example.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { BanorteButton } from '../components/ui/BanorteButton';
import { BanorteTextField } from '../components/ui/BanorteTextField';
import { BanorteModal } from '../components/ui/BanorteModal';
import { BanorteHeader } from '../components/layout/BanorteHeader';

const ExamplePage: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Box>
      <BanorteHeader
        title="Sistema de Gestión"
        user={{ name: "Usuario Ejemplo", email: "usuario@banorte.com" }}
      />

      <Container maxWidth="md" sx={{ mt: 10, py: 4 }}>
        <Typography variant="h1" gutterBottom>
          Ejemplo de Implementación
        </Typography>

        <Typography variant="body1" paragraph>
          Este es un ejemplo de cómo usar los componentes del sistema de diseño Banorte.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <BanorteButton variant="primary">
            Botón Primario
          </BanorteButton>
          <BanorteButton variant="outline">
            Botón Outline
          </BanorteButton>
          <BanorteButton
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            Abrir Modal
          </BanorteButton>
        </Box>

        <BanorteTextField
          label="Campo de ejemplo"
          placeholder="Ingresa tu texto aquí"
          helperText="Este es un campo de texto con el estilo Banorte"
        />

        <BanorteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Modal de Ejemplo"
          actions={
            <>
              <BanorteButton variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </BanorteButton>
              <BanorteButton variant="primary" onClick={() => setModalOpen(false)}>
                Confirmar
              </BanorteButton>
            </>
          }
        >
          <Typography>
            Este es un modal siguiendo las especificaciones de diseño de Banorte.
            El ancho máximo es de 720px y la altura mínima de 320px.
          </Typography>
        </BanorteModal>
      </Container>
    </Box>
  );
};

export default ExamplePage;
```

## Lista de Verificación para Migración

### ✅ Preparación del Proyecto
- [ ] Verificar versiones actuales de dependencias
- [ ] Crear backup del proyecto antes de cambios
- [ ] Instalar dependencias requeridas de Material-UI 5.15.1
- [ ] Verificar compatibilidad con React 18.2.0 y Next.js 14.0.4

### ✅ Configuración del Sistema de Diseño
- [ ] Crear archivo `banorte.theme.ts` con configuración completa
- [ ] Configurar fuentes Gotham y Roboto
- [ ] Implementar colores oficiales de Banorte
- [ ] Configurar ThemeProvider en la aplicación

### ✅ Migración de Componentes
- [ ] Crear componentes base (BanorteButton, BanorteTextField, etc.)
- [ ] Inventariar y priorizar componentes existentes para migración
- [ ] Crear wrappers de transición para migración gradual
- [ ] Actualizar imports y referencias a nuevos componentes

### ✅ Validación Visual
- [ ] Verificar que botones usen altura de 45px
- [ ] Comprobar border radius de 4px en componentes
- [ ] Validar uso correcto de colores oficiales (#EB0029, etc.)
- [ ] Verificar tipografía (Gotham para UI, Roboto para contenido)
- [ ] Comprobar espaciados basados en múltiplos de 8px

### ✅ Pruebas de Funcionalidad
- [ ] Validar estados de hover y focus en componentes
- [ ] Probar modales con dimensiones correctas (720px max width)
- [ ] Verificar accesibilidad y contraste de colores
- [ ] Probar responsividad en diferentes dispositivos

### ✅ Optimización Final
- [ ] Eliminar código CSS/componentes obsoletos
- [ ] Optimizar imports de Material-UI
- [ ] Verificar que no hay regresiones visuales
- [ ] Documentar cambios para el equipo

## Especificaciones Técnicas

### Colores Oficiales
```css
--banorte-red: #EB0029
--banorte-red-hover: #E30028
--banorte-primary-light: #EBF0F2
--surface-1: #FFFFFF
--surface-2: #F8F9FA
--text-primary: #323E48
--text-secondary: #5B6670
--text-disabled: #7B868C
--success: #6CC04A
--warning: #FFA400
--error: #FF671B
```

### Tipografía
- **Gotham**: Headers (h1-h4), botones, elementos de UI
- **Roboto**: Contenido (body1, body2), campos de texto

### Medidas Oficiales
- **Botones primarios**: 45px de altura
- **Border radius**: 4px (componentes), 8px (modales)
- **Modales**: Max width 720px, min height 320px
- **Spacing**: Sistema basado en múltiplos de 8px
- **Header**: 64px de altura

### Fuentes Web
```html
<!-- Agregar en el <head> de tu aplicación -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<!-- Gotham debe incluirse como archivo local o CDN según disponibilidad -->
```

---

Esta guía proporciona una implementación completa y lista para usar del sistema de diseño Banorte. Todos los componentes siguen las especificaciones oficiales y pueden integrarse directamente en proyectos React + Next.js + Material-UI.