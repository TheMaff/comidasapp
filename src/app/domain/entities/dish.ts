import { Ingredient } from '../value-objects/ingredient';

export interface Nutrition {
    kcal: number;
    protein: number;  // g
    carbs: number;    // g
    fat: number;      // g
}

export interface DishProps {
    id: string;
    ownerId: string;
    name: string;
    servings: number;
    ingredients: Ingredient[];
    steps: string[];
    nutrition?: Nutrition;
    tags?: string[];
    createdAt?: Date;
}

/**
 * Entidad Rica de Dominio: Dish (Plato)
 * Encapsula datos y reglas de negocio.
 */
export class Dish {
    // Propiedades privadas o readonly para proteger la integridad
    constructor(private readonly props: DishProps) { }

    // Getters para acceder a los datos (Encapsulamiento)
    get id(): string { return this.props.id; }
    get name(): string { return this.props.name; }
    get ownerId(): string { return this.props.ownerId; }
    get servings(): number { return this.props.servings; }
    get ingredients(): Ingredient[] { return [...this.props.ingredients]; } // Copia defensiva
    get steps(): string[] { return this.props.steps; }
    get tags(): string[] { return this.props.tags || []; }

    // --- LÓGICA DE NEGOCIO (El "Poder" del Modelo Rico) ---

    /**
     * Determina si el plato es vegetariano basándose en sus tags o ingredientes.
     * (Esta lógica ahora vive aquí, no en un componente).
     */
    isVegetarian(): boolean {
        // 1. Revisar tags explícitos
        if (this.tags.some(t => t.toLowerCase() === 'vegetariano' || t.toLowerCase() === 'veggie')) {
            return true;
        }
        // 2. A futuro: Podríamos revisar la lista de ingredientes aquí
        return false;
    }

    /**
     * Calcula el costo estimado por porción (si tuviéramos precios en ingredientes).
     * Ejemplo de método de dominio.
     */
    hasNutritionInfo(): boolean {
        return !!this.props.nutrition;
    }

    /**
     * Factory Method para reconstruir desde la Base de Datos (Infraestructura -> Dominio)
     */
    static fromPrimitives(props: DishProps): Dish {
        return new Dish({
            ...props,
            createdAt: props.createdAt ? new Date(props.createdAt) : new Date()
        });
    }

    /**
     * Convierte la entidad a objeto plano para guardar en BD (Dominio -> Infraestructura)
     */
    toPrimitives(): DishProps {
        return { ...this.props };
    }
}