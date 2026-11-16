// Avisos cortos en pantalla (no necesitan Redux ni contexto)
import type { RewardResult } from "../services/Firebase/FirestoreActions";

type ToastType = "success" | "error" | "info" | "celebration";

const COLORS: Record<ToastType, { bg: string, text: string }> = {
    success: { bg: "#A8F25D", text: "#121212" },
    error: { bg: "#F2622E", text: "#FFFFFF" },
    info: { bg: "#2D18BF", text: "#FFFFFF" },
    celebration: { bg: "#CCFC56", text: "#121212" },
};

const getContainer = () => {
    let container = document.getElementById("capyToastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "capyToastContainer";
        Object.assign(container.style, {
            position: "fixed",
            top: "16px",
            right: "16px",
            left: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            zIndex: "10001",
            pointerEvents: "none",
        } as CSSStyleDeclaration);
        document.body.appendChild(container);
    }
    return container;
};

export const showToast = (message: string, type: ToastType = "info", durationMs = 3500) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    Object.assign(toast.style, {
        maxWidth: "360px",
        padding: "12px 16px",
        borderRadius: "12px",
        background: COLORS[type].bg,
        color: COLORS[type].text,
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        opacity: "0",
        transform: "translateY(-8px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        pointerEvents: "auto",
    } as CSSStyleDeclaration);

    const container = getContainer();
    container.appendChild(toast);
    // Máximo 3 avisos visibles: se quita el más viejo
    while (container.children.length > 3 && container.firstElementChild) {
        container.removeChild(container.firstElementChild);
    }
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-8px)";
        setTimeout(() => toast.remove(), 300);
    }, durationMs);
};

// Muestra lo que ganó el usuario: puntos, subida de nivel (HU45) y racha (HU44)
// "title" es el mensaje de la acción (por ejemplo "Ingreso registrado") y va en el mismo aviso.
export const showRewardToasts = (reward: RewardResult, title?: string) => {
    if (reward.points > 0) {
        const points = `+${reward.points} Capypoints · +${reward.exp} XP`;
        showToast(title ? `${title} · ${points}` : points, "success");
    } else if (title) {
        showToast(title, "success");
    }
    if (reward.leveledUp) {
        showToast(`¡Subiste de nivel! Ahora eres ${reward.levelName}`, "celebration", 5000);
    }
    if (reward.streakIncreased && reward.streak > 1) {
        showToast(`🔥 Racha de ${reward.streak} días`, "info");
    }
};
