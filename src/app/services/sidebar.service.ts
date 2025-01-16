import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Menu',
      icono: 'icon',
      submenu: [
        { titulo: 'Dashboard', url: '/'},
        { titulo: 'Dishes', url: 'dishes'},
        { titulo: 'ProgressBar', url: 'progress'},
        { titulo: 'Graficas', url: 'grafica1'},

        { titulo: 'Perfil', url: '/'},
        { titulo: 'Informes', url: '/'},
        { titulo: 'Configuracion', url: 'account-settings' },
        
        //
        { titulo: 'Logout', url: '/login'}
      ]
    }
  ];


  constructor() { }
}
