import { Routes } from '@angular/router';
import { ShoppingListComponent } from './pages/shopping-list/shopping-list.component';

export const SHOPPING_ROUTES: Routes = [
    {
        path: '',
        component: ShoppingListComponent
    }
];

export default SHOPPING_ROUTES;