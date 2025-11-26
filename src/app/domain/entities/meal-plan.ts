// src/app/domain/entities/meal-plan.ts

// Value Object (sigue siendo una interfaz porque es parte de la data interna)
export interface MealAssignment {
    date: string;    // ISO yyyy-mm-dd
    dishId: string;  // ID del plato
    // forMembers?: string[]; // (Reservado para futuro)
}

// DTO interno para las propiedades crudas (lo que guardamos en BD)
export interface MealPlanProps {
    id: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    assignments: MealAssignment[];
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Entidad Rica: MealPlan (Plan de Comidas)
 * Encapsula la lógica de asignación de platos a días.
 */
export class MealPlan {

    constructor(private props: MealPlanProps) { }

    // --- Getters (Encapsulamiento) ---
    get id(): string { return this.props.id; }
    get ownerId(): string { return this.props.ownerId; }
    get startDate(): string { return this.props.startDate; }
    get endDate(): string { return this.props.endDate; }

    // Devolvemos una copia para evitar mutaciones externas accidentales
    get assignments(): MealAssignment[] { return [...this.props.assignments]; }

    // --- LÓGICA DE DOMINIO (El Cerebro) ---

    /**
     * Obtiene el ID del plato asignado para una fecha específica.
     * Retorna null si no hay nada asignado.
     */
    getDishIdForDate(dateISO: string): string | null {
        const match = this.props.assignments.find(a => a.date === dateISO);
        return match ? match.dishId : null;
    }

    /**
     * Asigna (o reasigna) un plato a una fecha.
     * Maneja la lógica de buscar si ya existe y actualizarlo, o crear uno nuevo.
     */
    assignDish(dateISO: string, dishId: string): void {
        const index = this.props.assignments.findIndex(a => a.date === dateISO);

        if (index >= 0) {
            // Ya existe asignación para este día -> Actualizamos
            // (Usamos inmutabilidad local para ser limpios)
            const updatedAssignment = { ...this.props.assignments[index], dishId };
            this.props.assignments[index] = updatedAssignment;
        } else {
            // No existe -> Agregamos
            this.props.assignments.push({ date: dateISO, dishId });
        }

        this.touch(); // Actualizamos fecha de modificación
    }

    /**
     * Elimina la asignación de un día (limpiar el día).
     */
    removeAssignment(dateISO: string): void {
        this.props.assignments = this.props.assignments.filter(a => a.date !== dateISO);
        this.touch();
    }

    /**
     * Verifica si una fecha está dentro del rango del plan.
     */
    includesDate(dateISO: string): boolean {
        return dateISO >= this.props.startDate && dateISO <= this.props.endDate;
    }

    // Actualiza el timestamp de modificación
    private touch(): void {
        this.props.updatedAt = new Date().toISOString();
    }

    // --- MAPPERS (Infraestructura <-> Dominio) ---

    static fromPrimitives(props: MealPlanProps): MealPlan {
        return new MealPlan({
            ...props,
            // Aseguramos que assignments sea un array
            assignments: props.assignments || []
        });
    }

    toPrimitives(): MealPlanProps {
        return { ...this.props };
    }
}