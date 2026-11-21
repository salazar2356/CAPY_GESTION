// Si el celular no logra conectarse con Firestore, las escrituras se quedan esperando
// para siempre y la app parece no hacer nada ("Saving..." sin fin).
// Esta función corta la espera y devuelve un error que la app muestra al usuario.

export const FIRESTORE_TIMEOUT_MS = 15000;

export const withTimeout = <T>(promise: Promise<T>, ms: number = FIRESTORE_TIMEOUT_MS): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject({ code: "network/timeout", message: "Firestore no respondió a tiempo" });
        }, ms);
        promise.then(
            (value) => { clearTimeout(timer); resolve(value); },
            (error) => { clearTimeout(timer); reject(error); }
        );
    });
