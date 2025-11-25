export interface MealPlan {
    id: string;
    ownerId: string;               // uid
    startDate: string;             // ISO yyyy-mm-dd
    endDate: string;               // ISO yyyy-mm-dd
    assignments: MealAssignment[]; // 1 por día (MVP: 1 almuerzo)
    createdAt?: string;
    updatedAt?: string;
}

export interface MealAssignment {
    date: string;                  // ISO yyyy-mm-dd
    dishId: string;              // receta asignada
    forMembers?: string[];         // opcional: ids si se personaliza
}
