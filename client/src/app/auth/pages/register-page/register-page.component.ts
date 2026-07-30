import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private fb          = inject(FormBuilder);
  private router       = inject(Router);
  private authService = inject(AuthService);

  public registerForm: FormGroup = this.fb.group({
    name    : ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email   : ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, lastname, email, password } = this.registerForm.value;

    this.authService.register( name, lastname, email, password ).subscribe({
      next: () => {
        Swal.fire('Cuenta creada', 'Ya puedes iniciar sesión', 'success');
        this.router.navigateByUrl('/auth/login');
      },
      error: ( message ) => Swal.fire('Error', message, 'error')
    });
  }

}
