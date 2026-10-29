export async function load(fileName) {
    try {
        const response = await fetch(`./${fileName}`);

        if (!response.ok) {
            console.error("Не вдалося завантажити фендоми: сервер відповів з помилкою");
            return;
        }
        return await response.json();
    }
    catch (error) {
        console.error("Критична помилка мережі:", error); // Сюди код потрапить, ТІЛЬКИ якщо пропав інтернет або файл взагалі зник
    }
}