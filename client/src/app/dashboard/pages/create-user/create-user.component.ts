import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  private initialRole = 'user';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['user', Validators.required],
      enabled: [true]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.isEditMode = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      this.userService.getUser(this.userId).subscribe({
        next: user => {
          this.initialRole = user.role;
          this.userForm.patchValue({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            enabled: user.enabled
          });
        },
        error: () => Swal.fire('Error', 'No se pudo cargar el usuario', 'error')
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    if (this.isEditMode) {
      this.updateExistingUser();
    } else {
      this.createNewUser();
    }
  }

  private createNewUser(): void {
    const { name, lastname, email, password, role } = this.userForm.value;

    this.userService.createUser({ name, lastname, email, password, role }).subscribe({
      next: () => {
        Swal.fire('Creado', 'El usuario se creó correctamente', 'success');
        this.router.navigate(['/dashboard/users-list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear el usuario', 'error')
    });
  }

  private updateExistingUser(): void {
    const { name, lastname, email, enabled, role } = this.userForm.value;

    this.userService.updateUser(this.userId!, { name, lastname, email, enabled }).subscribe({
      next: () => {
        if (role !== this.initialRole) {
          this.userService.changeRole(this.userId!, role).subscribe({
            next: () => this.finishUpdate(),
            error: () => Swal.fire('Error', 'El usuario se actualizó, pero no se pudo cambiar el rol', 'error')
          });
        } else {
          this.finishUpdate();
        }
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
    });
  }

  private finishUpdate(): void {
    Swal.fire('Actualizado', 'El usuario se actualizó correctamente', 'success');
    this.router.navigate(['/dashboard/users-list']);
  }

}
