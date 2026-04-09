export async function obtenerUsuariosFormateados() {
    try {
        //fetch()
        const respuesta = await fetch('https://api.escuelajs.co/api/v1/users')
        const users = await respuesta.json()

        // formateo JSON con map() => id, email, name
        const usersFormateado = users.map((usuarios) => {
            return {
                id: usuarios.id,
                email: usuarios.email,
                name: usuarios.name
            }
        })

        return usersFormateado

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}