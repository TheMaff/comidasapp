import { inject } from '@angular/core';
import {
  Firestore, doc, setDoc, collection, query, where, getDocs
} from '@angular/fire/firestore';
import { MealPlanRepository } from '../../../domain/repositories/meal-plan.repository';
import { MealPlan } from '../../../domain/entities/meal-plan';

export class MealPlanFirebaseRepository implements MealPlanRepository {
  private fs = inject(Firestore);
  private col = 'mealPlans';

  async getByRange(ownerId: string, startDate: string, endDate: string): Promise<MealPlan | null> {
    // MVP: 1 plan activo por rango exacto del usuario (ajustatble)
    const q = query(
      collection(this.fs, this.col),
      where('ownerId', '==', ownerId),
      where('startDate', '==', startDate),
      where('endDate', '==', endDate)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<MealPlan, 'id'>) };
  }

  async save(plan: MealPlan): Promise<void> {
    const ref = plan.id
      ? doc(this.fs, `${this.col}/${plan.id}`)
      : doc(collection(this.fs, this.col));
    const id = ref.id;
    const toSave: MealPlan = { ...plan, id };
    await setDoc(ref, toSave, { merge: true });
  }
}