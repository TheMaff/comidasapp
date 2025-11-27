import { Routes } from '@angular/router';
import { ProfileFormComponent } from './pages/profile-form/profile-form.component';

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        component: ProfileFormComponent
    }
];

export default PROFILE_ROUTES;