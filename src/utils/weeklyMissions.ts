// HU43: misiones semanales. Cada lunes se eligen 3 misiones nuevas de esta lista.
// Se verifican con el historial de puntos, que guarda la fecha y el motivo de cada acción.

export interface WeeklyMissionTemplate {
    kind: string,
    name: string,
    description: string,
    color: string,
    capypoints: number,
    exp: number,
    target: number,
    // Texto del historial de puntos que cuenta para esta misión
    matches: (reason: string) => boolean
}

export const WEEKLY_MISSION_TEMPLATES: Array<WeeklyMissionTemplate> = [
    {
        kind: "expenses",
        name: "Track your spending",
        description: "Register 3 expenses this week.",
        color: "#2D18BF",
        capypoints: 60,
        exp: 80,
        target: 3,
        matches: (reason) => reason.startsWith("Registered an expense"),
    },
    {
        kind: "income",
        name: "Count your money",
        description: "Register an income this week.",
        color: "#F2622E",
        capypoints: 40,
        exp: 60,
        target: 1,
        matches: (reason) => reason.startsWith("Registered an income"),
    },
    {
        kind: "deposit",
        name: "Saver of the week",
        description: "Make 2 deposits to your savings goals this week.",
        color: "#A8F25D",
        capypoints: 80,
        exp: 100,
        target: 2,
        matches: (reason) => reason.startsWith("Saved money in a goal"),
    },
    {
        kind: "planned",
        name: "Plan ahead",
        description: "Add a budget to your monthly planner this week.",
        color: "#2D18BF",
        capypoints: 40,
        exp: 60,
        target: 1,
        matches: (reason) => reason.startsWith("Planned an expense"),
    },
    {
        kind: "active",
        name: "Stay consistent",
        description: "Register 5 movements of any kind this week.",
        color: "#F2622E",
        capypoints: 70,
        exp: 90,
        target: 5,
        matches: (reason) => reason.startsWith("Registered an"),
    },
];

const DAY_MS = 24 * 60 * 60 * 1000;

const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromKey = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
};

// Lunes de la semana actual (hora local)
export const getWeekStartKey = (now: Date = new Date()): string => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = date.getDay(); // 0 = domingo
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return toKey(date);
};

// La semana termina el domingo a las 11:59 p. m.
export const getWeekEnd = (weekStart: string): Date => new Date(fromKey(weekStart).getTime() + 7 * DAY_MS - 1);

// HU43 (CA3): días que quedan para completar la misión (cuenta el día de hoy)
export const getDaysLeft = (weekStart: string, now: Date = new Date()): number => {
    const end = getWeekEnd(weekStart);
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY_MS));
};

// 3 misiones distintas por semana; la misma semana siempre da las mismas misiones
export const buildWeeklyMissions = (weekStart: string) => {
    const seed = weekStart.split("-").reduce((acc, n) => acc * 31 + Number(n), 7);
    const pool = [...WEEKLY_MISSION_TEMPLATES];
    const chosen: Array<WeeklyMissionTemplate> = [];
    let s = seed;
    while (chosen.length < 3 && pool.length > 0) {
        s = (s * 1103515245 + 12345) % 2147483648;
        chosen.push(pool.splice(s % pool.length, 1)[0]);
    }
    return chosen.map((t) => ({
        id: `${weekStart}-${t.kind}`,
        kind: t.kind,
        name: t.name,
        description: t.description,
        color: t.color,
        capypoints: t.capypoints,
        exp: t.exp,
        target: t.target,
        completed: false,
    }));
};

// Cuántas acciones de la misión hizo el usuario durante la semana
export const getWeeklyMissionProgress = (
    mission: { kind: string },
    weekStart: string,
    history: Array<{ date: Date, reason: string }>
): number => {
    const template = WEEKLY_MISSION_TEMPLATES.find((t) => t.kind === mission.kind);
    if (!template) return 0;
    const start = fromKey(weekStart).getTime();
    const end = getWeekEnd(weekStart).getTime();
    return history.filter((h) => {
        const t = h.date.getTime();
        return t >= start && t <= end && template.matches(h.reason);
    }).length;
};

export const isWeeklyMissionDone = (
    mission: { kind: string, target: number },
    weekStart: string,
    history: Array<{ date: Date, reason: string }>
) => getWeeklyMissionProgress(mission, weekStart, history) >= mission.target;
