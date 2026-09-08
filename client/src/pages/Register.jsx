import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerApplicant } from '../api/client';

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full Name cannot be empty')
    .min(2, 'Full Name must be at least 2 characters')
    .max(100, 'Full Name must be at most 100 characters')
    .regex(/^[A-Za-z ]+$/, 'Full Name may contain letters and spaces only'),
  age: z
    .string()
    .trim()
    .min(1, 'Age cannot be empty')
    .refine((val) => /^\d+$/.test(val), 'Age must be a number')
    .refine((val) => {
      const n = Number(val);
      return n >= 18 && n <= 120;
    }, 'Age must be between 18 and 120'),
  aadharNumber: z
    .string()
    .trim()
    .min(1, 'Aadhar Number cannot be empty')
    .regex(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits'),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile Number cannot be empty')
    .regex(/^[6-9]\d{9}$/, 'Mobile Number must be 10 digits and start with 6–9'),
  email: z
    .string()
    .trim()
    .min(1, 'Email cannot be empty')
    .email('Enter a valid email address'),
});

const fieldClass = (hasError) =>
  `w-full px-3.5 py-3 bg-white border ${
    hasError ? 'border-red-500' : 'border-slate-300'
  } rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-600`;

export default function Register() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [conflictMessage, setConflictMessage] = useState('');
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (values) => {
    setConflictMessage('');
    setFormError('');

    const payload = {
      name: values.name.trim(),
      age: Number(values.age),
      aadharNumber: values.aadharNumber.trim(),
      mobile: values.mobile.trim(),
      email: values.email.trim(),
    };

    try {
      const { ok, status, data } = await registerApplicant(payload);

      if (status === 201) {
        setSuccess({
          id: data?.id,
          status: data?.status || 'PENDING',
        });
        return;
      }

      if (status === 409) {
        setConflictMessage(data?.message || 'A registration with these details already exists.');
        return;
      }

      if (status === 400 && data?.errors && typeof data.errors === 'object') {
        Object.entries(data.errors).forEach(([field, message]) => {
          setError(field, { type: 'server', message: String(message) });
        });
        return;
      }

      setFormError(data?.message || 'Registration failed. Please try again.');
    } catch {
      setFormError('Unable to reach the server. Please ensure the API is running.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="bg-slate-900 text-white border-b border-slate-700">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-slate-300">Government Portal</p>
              <h1 className="text-lg font-semibold">Land Record Registration</h1>
            </div>
            <Link to="/status" className="text-sm text-slate-200 hover:text-white underline-offset-2 hover:underline">
              Check status
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl font-semibold">
              ✓
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Registration submitted</h2>
            <p className="text-slate-600 mb-6">Your registration is under review.</p>

            <div className="rounded-md bg-slate-50 border border-slate-200 text-left p-4 mb-6 space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Registration ID:</span>{' '}
                <span className="font-semibold text-slate-900">{success.id}</span>
              </p>
              <p>
                <span className="text-slate-500">Status:</span>{' '}
                <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
                  {success.status}
                </span>
              </p>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Please save your Registration ID to check status later.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate(`/status/${success.id}`)}
                className="px-4 py-2.5 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                Check my registration status
              </button>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="px-4 py-2.5 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Submit another registration
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-slate-300">Government Portal</p>
            <h1 className="text-lg font-semibold">Land Record Registration</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/status" className="text-slate-200 hover:text-white underline-offset-2 hover:underline">
              Check status
            </Link>
            <Link to="/admin" className="text-slate-200 hover:text-white underline-offset-2 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Applicant Registration</h2>
          <p className="text-sm text-slate-500 mb-6">
            Complete the form below. All fields are mandatory. Your application will be reviewed by an administrator.
          </p>

          {conflictMessage && (
            <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              {conflictMessage}
            </div>
          )}
          {formError && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                autoComplete="name"
                {...register('name')}
                className={fieldClass(errors.name)}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <input
                type="text"
                inputMode="numeric"
                {...register('age')}
                className={fieldClass(errors.age)}
                placeholder="Enter age"
              />
              {errors.age && <p className="mt-1.5 text-xs text-red-600">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Aadhar Number</label>
              <input
                type="text"
                inputMode="numeric"
                {...register('aadharNumber')}
                className={fieldClass(errors.aadharNumber)}
                placeholder="12-digit Aadhar number"
              />
              {errors.aadharNumber && (
                <p className="mt-1.5 text-xs text-red-600">{errors.aadharNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
              <input
                type="tel"
                {...register('mobile')}
                className={fieldClass(errors.mobile)}
                placeholder="10-digit mobile number"
              />
              {errors.mobile && <p className="mt-1.5 text-xs text-red-600">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className={fieldClass(errors.email)}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 py-3 rounded-md text-sm font-semibold text-white ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Registration'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
