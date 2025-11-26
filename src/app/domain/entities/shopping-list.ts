// src/app/domain/entities/shopping-list.ts

export interface ShoppingItem {
    name: string;
    amount: number;
    unit: string;
    checked: boolean;
    category?: string; // Futuro: Verduras, Carnes, etc.
}

export class ShoppingList {
    private _items: Map<string, ShoppingItem> = new Map();

    constructor(initialItems: ShoppingItem[] = []) {
        initialItems.forEach(item => this.addItem(item));
    }

    get items(): ShoppingItem[] {
        // Retornamos ordenados alfabéticamente
        return Array.from(this._items.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Agrega un item a la lista.
     * Si ya existe (mismo nombre y unidad), suma la cantidad.
     * Si no, lo crea.
     */
    addItem(item: { name: string; amount: number; unit: string }) {
        // Normalizamos la clave para evitar duplicados por mayúsculas/minúsculas
        // Clave compuesta: "cebolla_unidad"
        const key = `${item.name.trim().toLowerCase()}_${item.unit.trim().toLowerCase()}`;

        if (this._items.has(key)) {
            const existing = this._items.get(key)!;
            // Lógica de fusión: Sumar cantidades
            existing.amount += item.amount;
        } else {
            // Nuevo item
            this._items.set(key, {
                name: item.name, // Guardamos el nombre original (con mayúsculas si venía así)
                amount: item.amount,
                unit: item.unit,
                checked: false
            });
        }
    }

    /**
     * Método para marcar/desmarcar (útil para la UI interactiva)
     */
    toggleItem(name: string, unit: string) {
        const key = `${name.trim().toLowerCase()}_${unit.trim().toLowerCase()}`;
        const item = this._items.get(key);
        if (item) {
            item.checked = !item.checked;
        }
    }
}