if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registration =
                await navigator.serviceWorker.register("/sw.js");

            console.log(
                "Fandomium SW зареєстровано!",
                registration.scope
            );
        } catch (error) {
            console.error(
                "Помилка реєстрації SW:",
                error
            );
        }
    });
}