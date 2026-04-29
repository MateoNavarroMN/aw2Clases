# Repositorio de lo trabajado en clases

Las clases estaran en distintas carpetas.

## Comandos básicos de GIT

* git init -> solo la primera vez
* git config user.name miusuario -> la primera vez
* git config user.email miemail@mail.com -> la primera vez
* git remote add origin https://github.com/miusuario/mirepositorio.git -> configurar repo remoto
* Creamos un README.md
* git status -> para ver estado de seguimiento -> README.md aparece en rojo 
* git add . o git add ruta/nombreDeArchivo -> para marcar los archivos para guardar en repositorio.
* git status -> nuevamente para verificar si README.md está listo (staged) aparece en verde
* git commit -m "primer commit" -> Primer comit. Guardamos el seguimiento en local. 
* git branch -> vemos si la rama es main, si es master, cambiamos el nombre como sigue:
* `git branch -M main ` -> cambiamos nombre de rama a main
* git push -u origin main -> subimos al repositorio remoto

Al finalizar la clase, subimos lo que trabajamos repitiendo los pasos

* git add . -> para marcar los archivos para guardar en repositorio.
* git status -> verificar si están los cambios
* git commit -m "mensaje sobre lo que se trabajó"
* git push -> actualizamos el repositorio remoto. Aquí no hace falta indicar origin main porque con -u fijamos el nombre de destino. Ojo cuando trabajen con ramas separadas.

En casa, para seguir trabajando, clonamos el repo:

* git clone https://github.com/miusuario/mirepositorio.git -> bajan el repo una vez
* git config user.name miusuario -> identificarse
* git config user.email miemail@mail.com -> identificarse

Si ya lo bajaron, siempre verifiquen si están actualizadxs:

* git pull -> Siempre lo hacen para bajar los cambios del repo remoto y quedar en sincronía.


## Comandos básicos de NPM

* npm init -y -> solo la primera vez
* Verificar configuracion del package.json
* npm install un-paquete otro-paquete -> instalar uno o mas paquetes
* Configurar comando dentro de "scripts" -> por ejemplo "dev":"node index.js"
* npm run dev -> correr comando dev. Equivale a node index.js en consola.
* npm i -E express -> Instala express
* npm i -> para instalar las dependencias del proyecto 