export interface Ingredient {
    name: string;
    unit: 'g' | 'kg' | 'ml' | 'l' | 'unit' | string;
    amount: number;               // cantidad por porción
    pricePerUnit?: number;        // opcional: para costos
    store?: string;               // opcional: tienda sugerida
}
