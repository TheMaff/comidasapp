import { Component, OnInit } from '@angular/core';
import { ListUserRecipes } from '../../../../application/services/list-user-recipes.usecase';
import { AuthService } from '../../../../services/auth.service';
import { Recipe } from '../../../../domain/entities/dish';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule
  ],
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
})
export class RecipesListComponent implements OnInit {
  displayedColumns = ['name', 'servings', 'actions'];
  data: Recipe[] = [];
  loading = true;

  constructor(private listRecipes: ListUserRecipes, private auth: AuthService) { }

  async ngOnInit() {
    const uid = (await firstValueFrom(this.auth.user$))?.uid!;
    this.data = await this.listRecipes.execute(uid);
    this.loading = false;
  }
}
