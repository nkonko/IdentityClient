import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card"><h2>Dashboard (placeholder)</h2>
      <p>Implementaremos widgets aquí usando los endpoints del API-client.</p>
    </div>
  `
})
export class DashboardComponent {}
