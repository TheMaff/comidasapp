// src/app/infrastructure/firebase/repositories/dish.firebase.repository.ts

import { inject } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
import { DishRepository } from '../../../domain/repositories/dish.repository';
import { Dish, DishProps } from '../../../domain/entities/dish'; // 👈 Importamos la Clase Dish
import { CreateDishDTO } from '../../../domain/dtos/create-dish.dto';

export class DishFirebaseRepository implements DishRepository {
    private fs = inject(Firestore);

    async getById(id: string): Promise<Dish | null> { // 👈 Prometemos devolver la Clase Dish
        const snap = await getDoc(doc(this.fs, `dishes/${id}`));
        if (!snap.exists()) return null;

        const data = snap.data() as Omit<DishProps, 'id'>;

        // 🚨 MAGIA DDD: Convertimos datos crudos -> Entidad Rica
        return Dish.fromPrimitives({
            id: snap.id,
            ...data
        });
    }

    async listByUser(userId: string): Promise<Dish[]> {
        // ⚠️ CORRECCIÓN: Asegúrate de que la colección sea 'dishes' (antes tenías 'recipes')
        const q = query(collection(this.fs, 'dishes'), where('ownerId', '==', userId));
        const res = await getDocs(q);

        return res.docs.map(d => {
            const data = d.data() as Omit<DishProps, 'id'>;
            // 🚨 Hidratamos cada elemento de la lista
            return Dish.fromPrimitives({
                id: d.id,
                ...data
            });
        });
    }

    // ℹ️ Nota: create recibe DTO (sin ID) según definimos antes
    async create(dishData: CreateDishDTO): Promise<void> {
        // Generamos el ID aquí (Infraestructura)
        const newId = doc(collection(this.fs, 'dishes')).id;

        // Guardamos el objeto plano (Firestore no guarda Clases)
        await setDoc(doc(this.fs, `dishes/${newId}`), {
            ...dishData,
            id: newId, // Añadimos el ID generado
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    // ℹ️ Nota: update recibe la Entidad Rica Dish
    async update(dish: Dish): Promise<void> {
        // 🚨 Usamos .toPrimitives() para guardar JSON limpio en Firebase
        // Si intentas guardar 'dish' directo, Firebase fallará al intentar serializar los métodos.
        const plainData = dish.toPrimitives();

        // Removemos el ID del payload para no duplicarlo dentro del documento si no quieres
        const { id, ...rest } = plainData;

        await setDoc(doc(this.fs, `dishes/${id}`), {
            ...rest,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(this.fs, `dishes/${id}`));
    }
}