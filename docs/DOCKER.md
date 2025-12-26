# 🐳 Configuración de Docker - PostgreSQL

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Puerto 5432 disponible (no usado por otra instancia de PostgreSQL)

## Configuración de la Base de Datos

### 1. Iniciar Docker Desktop

Asegúrate de que Docker Desktop esté ejecutándose en tu sistema.

### 2. Levantar el contenedor de PostgreSQL

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Esto creará y ejecutará un contenedor con:
- **Nombre**: `pictionary_postgres`
- **Usuario**: `pictionary_user`
- **Contraseña**: `pictionary_password`
- **Base de datos**: `pictionary_db`
- **Puerto**: `5432`

### 3. Verificar que el contenedor está corriendo

```bash
docker ps
```

Deberías ver el contenedor `pictionary_postgres` en la lista.

### 4. Ver logs del contenedor (si necesitas debug)

```bash
docker logs pictionary_postgres
```

## Comandos Útiles

### Detener el contenedor

```bash
docker-compose down
```

### Detener y eliminar volúmenes (borra los datos)

```bash
docker-compose down -v
```

### Conectarse a PostgreSQL desde la terminal

```bash
docker exec -it pictionary_postgres psql -U pictionary_user -d pictionary_db
```

### Hacer backup de la base de datos

```bash
docker exec -t pictionary_postgres pg_dump -U pictionary_user pictionary_db > backup.sql
```

### Restaurar desde backup

```bash
docker exec -i pictionary_postgres psql -U pictionary_user -d pictionary_db < backup.sql
```

## Configuración en el Backend

El archivo `apps/backend/.env` debe tener las siguientes variables configuradas:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=pictionary_user
DATABASE_PASSWORD=pictionary_password
DATABASE_NAME=pictionary_db
```

## Solución de Problemas

### Puerto 5432 ya en uso

Si tienes PostgreSQL instalado localmente, puede estar usando el puerto 5432. Opciones:

1. Detener PostgreSQL local
2. Cambiar el puerto en `docker-compose.yml` (ej: `5433:5432`)

### Docker Desktop no está corriendo

Error: `open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.`

**Solución**: Inicia Docker Desktop desde el menú de inicio de Windows.

### El contenedor no inicia

```bash
docker logs pictionary_postgres
```

Revisa los logs para identificar el problema.

## Volúmenes de Datos

Los datos de PostgreSQL se almacenan en un volumen Docker llamado `postgres_data`. Esto significa que:

- Los datos persisten aunque detengas el contenedor
- Puedes reiniciar el contenedor sin perder datos
- Para eliminar los datos completamente, usa `docker-compose down -v`

## Health Check

El contenedor tiene un health check configurado que verifica cada 10 segundos si PostgreSQL está listo para aceptar conexiones. Puedes ver el estado con:

```bash
docker inspect pictionary_postgres | grep -A 10 Health
```
