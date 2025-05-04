import { Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  roles = [
    { value: 'client', label: 'Client' },
    { value: 'professional', label: 'Professionnel' }
  ];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['hech'],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['client', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { name, email, password, role } = this.registerForm.value;

    this.authService.register({ name, email, password, role }).subscribe({
      next: (user) => {
        const redirectPath = user.role === 'professional' ? '/dashboard-pro' : '/dashboard-client';
        this.router.navigate([redirectPath]);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
        this.isLoading = false;
      }
    });
  }
}
