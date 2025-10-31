// src/app/shared/validations/custom-validations.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidations {
  // ✅ Email pattern validation (used in Login)
  static validEmail(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }

  // ✅ Password length validation (used in Login)
  static minPasswordLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length >= minLength ? null : { minPasswordLength: true };
    };
  }

  // ✅ Event code must be exactly 6 characters
  static fixedLengthCode(requiredLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length === requiredLength ? null : { invalidCodeLength: true };
    };
  }

  // ✅ Positive number check
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value >= 0 ? null : { negativeValue: true };
    };
  }

  // ✅ Date range validation (start < end)
  static startBeforeEnd(startKey: string, endKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get(startKey)?.value;
      const end = formGroup.get(endKey)?.value;

      if (start && end && new Date(start) > new Date(end)) {
        return { invalidDateRange: true };
      }
      return null;
    };
  }

  // ✅ Generic required string check (trimmed)
  static requiredString(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value || '').trim();
      return value ? null : { requiredString: true };
    };
  }
}
// src/app/shared/custome-validations.ts
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, } from '@angular/forms';
// import  from '@angular/forms';

/* -----------------------
   Validator functions
   ----------------------- */

/** Email validator: enforces general email format AND that the domain is 'bajaj.com' */
export function customEmailValidatorFn(control: AbstractControl): ValidationErrors | null {
  const val: string = (control.value ?? '').trim();
  if (!val) return null;

  // basic email format check
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(val)) {
    return { invalidEmailFormat: { message: 'Please enter a valid email (e.g. john@bajaj.com).' } };
  }

  // enforce specific domain (change this if you want other allowed domains)
  const requiredDomain = 'bajaj.com';
  const domain = val.split('@')[1]?.toLowerCase() ?? '';
  if (domain !== requiredDomain) {
    return {
      domainMismatch: {
        requiredDomain,
        actualDomain: domain,
        message: `Email must be a ${requiredDomain} address (example: john@${requiredDomain}).`,
      },
    };
  }

  return null;
}

/** Password validator: minimum length 6, at least one letter & one number */
export function customPasswordValidatorFn(control: AbstractControl): ValidationErrors | null {
  const val: string = control.value ?? '';
  if (!val) return null;

  if (val.length < 6) {
    return {
      minlength: {
        requiredLength: 6,
        actualLength: val.length,
        message: `Password must be at least 6 characters.`,
      },
    };
  }

  const hasLetter = /[A-Za-z]/.test(val);
  const hasNumber = /\d/.test(val);
  if (!hasLetter || !hasNumber) {
    return {
      weakPassword: {
        missingLetter: !hasLetter,
        missingNumber: !hasNumber,
        message: 'Password must contain at least one letter and one number.',
      },
    };
  }

  return null;
}

/* -----------------------
   Directive wrappers (for template-driven forms)
   ----------------------- */

@Directive({
  selector: '[appEmailValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmailValidatorDirective),
      multi: true,
    },
  ],
})
export class EmailValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return customEmailValidatorFn(control);
  }
}

@Directive({
  selector: '[appPasswordValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordValidatorDirective),
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return customPasswordValidatorFn(control);
  }
}

/* -----------------------
   Also export the raw functions for reactive forms usage
   ----------------------- */
export const emailValidatorForReactive: ValidatorFn = customEmailValidatorFn;
export const passwordValidatorForReactive: ValidatorFn = customPasswordValidatorFn;
