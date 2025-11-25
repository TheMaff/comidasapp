import { inject } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
import { RecipeRepository } from '../../../domain/repositories/recipe.repository';
import { Recipe } from '../../../domain/entities/dish';

export class RecipeFirebaseRepository implements RecipeRepository {
    private fs = inject(Firestore);

    async getById(id: string): Promise<Recipe | null> {
        const snap = await getDoc(doc(this.fs, `recipes/${id}`));
        if (!snap.exists()) return null;
        const data = snap.data() as Omit<Recipe, 'id'>;
        return { id: snap.id, ...data };
    }

    async listByUser(userId: string): Promise<Recipe[]> {
        const q = query(collection(this.fs, 'recipes'), where('ownerId', '==', userId));
        const res = await getDocs(q);
        return res.docs.map(d => {
            const data = d.data() as Omit<Recipe, 'id'>;
            return { id: d.id, ...data };
        })
    }

    async create(recipe: Recipe): Promise<void> {
        await setDoc(doc(this.fs, `recipes/${recipe.id}`), {
            ...recipe,
            createdAt: recipe.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    async update(recipe: Recipe): Promise<void> {
        await setDoc(doc(this.fs, `recipes/${recipe.id}`), {
            ...recipe,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(this.fs, `recipes/${id}`));
    }
}
