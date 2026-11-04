import { Timestamp } from "firebase/firestore";

export const convertTimestampToDate = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000); // Convierte a milisegundos y lo retorna convertido a una date
};

export const formatDate = (dateString: string) => new Date(dateString)

// Convierte un string en formato ISO a un Timestamp de Firebase
export const convertISOStringToTimestamp = (isoString: string): Timestamp => {
    const date = new Date(isoString); // Convierte el ISO string a un objeto Date
    return Timestamp.fromDate(date); // Convierte el objeto Date a un Timestamp
};

export const getCurrentTimestamp = (): Timestamp => {
    return Timestamp.fromDate(new Date());
};