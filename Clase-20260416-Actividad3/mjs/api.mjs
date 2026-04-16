export async function obtenerUsuariosApi() {
    try {
        // Fetch a API externa
        const respuestaApi = await fetch('https://api.escuelajs.co/api/v1/users')
        const datosApi = await respuestaApi.json()
        return datosApi
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}