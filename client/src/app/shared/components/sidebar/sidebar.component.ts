import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  constructor( private router: Router ) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}
