# Courses - TP - Objetivo 3 - Grupo 12

# Base de Datos
MySQL. El dump está en la carpeta db.

# Pruebas en postman:
1. Para agregar un nuevo curso de formación, acceder a https://localhost:3000/courses usando metodo POST. Usando POST, dentro de Body utilizar "raw", JSON y agregar: { "nombre": "Nombre Curso", "costo": "Costo Curso" }. No se va a permitir el acceso. Lo mismo para eliminar o modificar un curso (con DELETE y PUT) o para consultar todos los usuarios (GET).
2. Se puede crear un usuario en la URL: https://localhost:3000/users/signup, Usando POST, dentro de Body utilizar "raw", JSON y agregar: { "nombre": "Nombre Apellido", "email": "emailusuario", "password":"password" }. O acceder con email: pepe.honguito@gmail.com, password: PepeHonguito123
3. Login con https://localhost:3000/users/login usando metodo POST y agregar: { "email": "emailusuario", "password":"password" }
4. Utilizando el token obtenido anteriormente, repetir el paso 1 agregándolo dentro de un header llamado Authorization y Value = Bearer token. Se deberia poder acceder correctamente.

