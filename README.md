# Calculadora de Planilla

Aplicacion web en Next.js para calcular y presentar planillas academicas del grupo 4.
Incluye:

- acceso de administrador con modo demo o Supabase Auth;
- calculo de salario, deducciones y cargas patronales;
- vistas de personal, busqueda individual y reporte de planilla;
- envio de reportes por correo con Resend;
- esquema y datos semilla para Supabase.

## Clonar

```bash
git clone git@github.com:josemanuelsv18/Calculadora-de-Planilla.git
cd Calculadora-de-Planilla
```

## Ejecutar

1. Instala dependencias:

```bash
pnpm install
```

2. Copia las variables de entorno y ajusta los valores necesarios:

```bash
cp .env.example .env.local
```

3. Inicia la app:

```bash
pnpm dev
```

Abre `http://localhost:3000` en el navegador.

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `USE_SUPABASE_AUTH`
- `DEMO_ADMIN_EMAIL`
- `DEMO_ADMIN_PASSWORD`
- `RESEND_API_KEY`
- `REPORT_EMAIL_FROM`

## Notas

- Si Supabase no esta configurado, la app funciona con el acceso demo.
- Las migraciones y el seed viven en `supabase/`.
