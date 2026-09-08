import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  RiUser3Line,
  RiMailLine,
  RiPhoneLine,
  RiIdCardLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCustomerService2Line,
} from '@remixicon/react';
import { registerApplicant } from '../api/client';

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty"),
  age: z
    .string()
    .trim()
    .min(1, "Age cannot be empty")
    .refine((val) => /^\d+$/.test(val), "Age must be a number")
    .refine((val) => Number(val) >= 18, "Age should be 18 or above"),
  aadhar: z
    .string()
    .trim()
    .min(1, "Aadhar Number cannot be empty")
    .regex(/^\d{12}$/, "Aadhar should be 12 digits"),
  mobile: z
    .string()
    .trim()
    .min(1, "Mobile Number cannot be empty")
    .regex(/^\d{10}$/, "Mobile number should be 10 digits"),
  email: z.string().trim().min(1, "Email cannot be empty"),
});

const RegistrationForm = ({ onSuccess }) => {
  const [formError, setFormError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
  });

  const fieldClass = (hasError) =>
    `w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border ${hasError ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all text-sm`;

  const onSubmit = async (values) => {
    setFormError('');

    const payload = {
      name: values.name.trim(),
      age: Number(values.age),
      aadharNumber: values.aadhar.trim(),
      mobile: values.mobile.trim(),
      email: values.email.trim(),
    };

    try {
      const { ok, status, data } = await registerApplicant(payload);

      if (status === 201) {
        onSuccess({
          id: data?.id,
          status: data?.status || 'PENDING',
        });
        return;
      }

      if (status === 409) {
        setFormError(data?.message || 'A registration with these details already exists.');
        return;
      }

      setFormError(data?.message || 'Registration failed. Please try again.');
    } catch {
      setFormError('Unable to reach the server. Please ensure the API is running.');
    }
  };

  return (
    <div className="w-full lg:w-[440px] xl:w-[460px] flex flex-col justify-center">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] p-8 md:p-9 text-slate-800 border border-white/60">
        <div className="flex items-center justify-center mb-7">
          <img
            src="/logo_removed.png"
            alt="PMAY"
            className="h-12 object-contain mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">PMAY Portal</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-[0.14em] mt-0.5">GOVERNMENT OF INDIA</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-slate-900 mb-1 text-center">
          Create Account
        </h3>
        <p className="text-sm text-slate-500 mb-7 text-center">
          Register to apply under Pradhan Mantri Awas Yojana
        </p>

        {formError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <RiUser3Line size={18} />
              </div>
              <input
                autoComplete="off"
                {...register("name")}
                type="text"
                className={fieldClass(errors.name)}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <RiCalendarLine size={18} />
              </div>
              <input
                autoComplete="off"
                {...register("age")}
                type="text"
                inputMode="numeric"
                className={fieldClass(errors.age)}
                placeholder="Enter your age"
              />
            </div>
            {errors.age && <p className="mt-1.5 text-xs text-red-500">{errors.age.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Aadhar Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <RiIdCardLine size={18} />
              </div>
              <input
                autoComplete="off"
                {...register("aadhar")}
                type="text"
                inputMode="numeric"
                className={fieldClass(errors.aadhar)}
                placeholder="Enter 12-digit Aadhar number"
              />
            </div>
            {errors.aadhar && <p className="mt-1.5 text-xs text-red-500">{errors.aadhar.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <RiPhoneLine size={18} />
              </div>
              <input
                autoComplete="off"
                {...register("mobile")}
                type="tel"
                className={fieldClass(errors.mobile)}
                placeholder="Enter mobile number"
              />
            </div>
            {errors.mobile && <p className="mt-1.5 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <RiMailLine size={18} />
              </div>
              <input
                autoComplete="off"
                {...register("email")}
                type="email"
                className={fieldClass(errors.email)}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-orange-600 to-amber-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-6 shadow-lg shadow-orange-900/25 ${
              isSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : 'cursor-pointer hover:from-orange-500 hover:to-amber-600 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? "Registering..." : "Submit Registration"}
            {!isSubmitting && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            )}
          </button>

          <div className="flex items-center justify-center mb-6 rounded-xl bg-emerald-50/90 px-3 py-2.5 border border-emerald-100">
            <RiCheckboxCircleLine size={18} className="mr-2 text-emerald-600 shrink-0" />
            <div className="text-xs font-medium text-center flex items-center gap-1.5 flex-wrap justify-center">
              <span className="text-slate-600">Your connection is secure</span>
              <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">256-bit SSL</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex items-center justify-center text-slate-500">
            <RiCustomerService2Line size={18} className="mr-2" />
            <span className="text-sm font-medium mr-1.5">Need Help?</span>
            <a href="#" className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors">Contact Support</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
