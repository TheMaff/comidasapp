import { inject, Injectable } from '@angular/core';
import {
  Firestore, doc, setDoc, collection, query, where, getDocs, limit, orderBy
} from '@angular/fire/firestore'; // 👈 Asegúrate de importar limit y orderBy
import { MealPlanRepository } from '../../../domain/repositories/meal-plan.repository';
import { MealPlan, MealPlanProps } from '../../../domain/entities/meal-plan';

@Injectable({ providedIn: 'root' })
export class MealPlanFirebaseRepository implements MealPlanRepository {
  private fs = inject(Firestore);
  private col = 'mealPlans';

  async getByRange(ownerId: string, startDate: string, endDate: string): Promise<MealPlan | null> {
    // ... (tu código existente de getByRange) ...
    // Copia lo que ya tenías aquí, no lo borres
    const q = query(
      collection(this.fs, this.col),
      where('ownerId', '==', ownerId),
      where('startDate', '==', startDate),
      where('endDate', '==', endDate)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    const rawData = d.data() as Omit<MealPlanProps, 'id'>;
    return MealPlan.fromPrimitives({ id: d.id, ...rawData });
  }

  async save(plan: MealPlan): Promise<void> {
    // ... (tu código existente de save) ...
    const data = plan.toPrimitives();
    const docRef = data.id
      ? doc(this.fs, `${this.col}/${data.id}`)
      : doc(collection(this.fs, this.col));
    const dataToSave = { ...data, id: docRef.id };
    await setDoc(docRef, dataToSave, { merge: true });
  }

  // 🚨 NUEVA IMPLEMENTACIÓN
  async findActivePlan(ownerId: string): Promise<MealPlan | null> {
    const today = new Date().toISOString().slice(0, 10);

    // Buscamos planes que terminen hoy o en el futuro
    const q = query(
      collection(this.fs, this.col),
      where('ownerId', '==', ownerId),
      where('endDate', '>=', today),
      // Opcional: ordenar por fecha de inicio descendente para obtener el más reciente
      // orderBy('endDate', 'desc'), 
      limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const d = snap.docs[0];
    const rawData = d.data() as Omit<MealPlanProps, 'id'>;

    // Hidratamos
    return MealPlan.fromPrimitives({
      id: d.id,
      ...rawData
    });
  }
}