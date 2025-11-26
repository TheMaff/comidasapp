import { inject, Injectable } from '@angular/core';
import {
  Firestore, doc, setDoc, collection, query, where, getDocs
} from '@angular/fire/firestore';
import { MealPlanRepository } from '../../../domain/repositories/meal-plan.repository';
import { MealPlan, MealPlanProps } from '../../../domain/entities/meal-plan';

@Injectable({ providedIn: 'root' })
export class MealPlanFirebaseRepository implements MealPlanRepository {
  private fs = inject(Firestore);
  private col = 'mealPlans'; // Colección en Firestore

  async getByRange(ownerId: string, startDate: string, endDate: string): Promise<MealPlan | null> {
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

    // 🚨 HIDRATACIÓN: Convertimos datos crudos de Firestore en una Entidad Rica
    return MealPlan.fromPrimitives({
      id: d.id,
      ...rawData
    });
  }

  async save(plan: MealPlan): Promise<void> {
    // 🚨 DESHIDRATACIÓN: Extraemos los datos planos de la clase para guardarlos
    const data = plan.toPrimitives();

    // Determinamos la referencia del documento
    // Nota: En DDD ideal, el ID ya debería existir en la entidad antes de llegar aquí.
    // Si es un plan nuevo sin ID (caso raro si usas create-usecase correctamente), 
    // Firestore generará uno, pero idealmente tu caso de uso debería asignar el ID.

    const docRef = data.id
      ? doc(this.fs, `${this.col}/${data.id}`)
      : doc(collection(this.fs, this.col));

    // Aseguramos que el objeto a guardar tenga el ID correcto si fue generado recién
    const dataToSave = { ...data, id: docRef.id };

    console.log('Saving MealPlan:', dataToSave);

    // Guardamos usando setDoc con merge para no sobrescribir campos no enviados (opcional)
    await setDoc(docRef, dataToSave, { merge: true });
  }
}