import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  users = computed(() => this.userService.userList());

  searchTerm = signal('');
  roleFilter = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const role = this.roleFilter();

    return this.users().filter(user => {
      const matchesTerm = !term
        || user.name.toLowerCase().includes(term)
        || user.lastname.toLowerCase().includes(term)
        || user.email.toLowerCase().includes(term);
      const matchesRole = !role || user.role === role;
      return matchesTerm && matchesRole;
    });
  });

  ngOnInit() {
    this.userService.getUsers().subscribe({
      error: err => console.error('Error al cargar los usuarios:', err)
    });
  }

  search(term: string) {
    this.searchTerm.set(term);
  }

  filterByRole(role: string) {
    this.roleFilter.set(role);
  }

  editUser(uid: string) {
    this.router.navigate(['/dashboard/users-list', uid, 'edit']);
  }

  toggleEnabled(uid: string, enabled: boolean) {
    const action = enabled
      ? this.userService.disableUser(uid)
      : this.userService.enableUser(uid);

    action.subscribe({
      next: () => Swal.fire(enabled ? 'Desactivado' : 'Activado', 'El usuario se actualizó correctamente', 'success'),
      error: () => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
    });
  }

}
