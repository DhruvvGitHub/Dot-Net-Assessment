import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  RiHomeHeartLine,
  RiShieldCheckLine,
  RiCommunityLine,
  RiUser3Line,
  RiLock2Line,
  RiEyeOffLine,
  RiEyeLine,
  RiCustomerService2Line,
  RiYoutubeFill,
  RiCheckboxCircleLine,
  RiMailLine,
  RiPhoneLine,
  RiIdCardLine,
  RiCalendarLine
} from '@remixicon/react';

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
});

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty"),
  age: z
    .string()
    .trim()
    .min(1, "Age cannot be empty")
    .refine((val) => /^\d+$/.test(val), "Age must be a number")
    .refine((val) => Number(val) > 18, "Age should be above 18"),
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

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: (values, context, options) =>
      zodResolver(isSignup ? signupSchema : loginSchema)(values, context, options),
    mode: "onSubmit",
  });

  const switchMode = (signup) => {
    setIsSignup(signup);
    setShowPassword(false);
    reset();
  };

  const fieldClass = (hasError) =>
    `w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border ${hasError ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all text-sm`;

  const onSubmit = async (data) => {
    if (isSignup) {
      console.log("Signup data:", data);
      alert("Registration submitted (frontend only for now).");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/auth/login?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (!response.ok) {
        alert(result);
        return;
      }

      localStorage.setItem("token", result);
      alert("Login successful!");
      console.log("JWT Token:", result);
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans text-white overflow-x-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/35 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/45 via-transparent to-emerald-950/25" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="flex-1 flex flex-col justify-center lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
          <div className="mb-10 inline-flex items-center self-start rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 px-5 py-3.5 shadow-lg">
            <img
              src="/logo_removed.png"
              alt="PMAY Logo"
              className="h-16 md:h-20 object-contain"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.15] mb-6 text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
            Pradhan Mantri Awas Yojana
            <span className="block mt-1 font-light text-white/90">Housing for All</span>
          </h1>

          <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-emerald-400 mb-8 rounded-full" />

          <p className="text-base md:text-lg text-white/85 mb-12 max-w-xl leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            PMAY enables affordable housing through credit-linked subsidy and beneficiary support for urban and rural households across India.
          </p>

          <div className="flex items-center gap-4 sm:gap-8 mb-14">
            {[
              { icon: RiHomeHeartLine, label: 'Affordable Homes' },
              { icon: RiShieldCheckLine, label: 'Secure Process' },
              { icon: RiCommunityLine, label: 'Inclusive Growth' },
            ].map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="h-10 w-px bg-white/25 hidden sm:block" />}
                <div className="flex flex-col items-center">
                  <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl mb-2.5 text-white border border-white/20 shadow-lg">
                    <Icon size={22} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide text-center">{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="mt-auto max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 flex items-center gap-4 shadow-xl">
            <div className="shrink-0 text-orange-300">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Ministry of Housing & Urban Affairs</p>
              <p className="text-xs text-white/70 mt-0.5">Government of India · Building homes, empowering lives</p>
            </div>
          </div>
        </div>

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
              {isSignup ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-sm text-slate-500 mb-7 text-center">
              {isSignup
                ? "Register to apply under Pradhan Mantri Awas Yojana"
                : "Sign in to continue to your account"}
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {isSignup ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">User ID / Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <RiUser3Line size={18} />
                      </div>
                      <input
                        autoComplete="off"
                        {...register("email")}
                        type="text"
                        className={fieldClass(errors.email)}
                        placeholder="Enter User ID or Email"
                      />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <RiLock2Line size={18} />
                      </div>
                      <input
                        autoComplete="off"
                        {...register("password")}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-11 pr-11 py-3.5 bg-slate-50/80 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all text-sm`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <RiEyeLine size={18} /> : <RiEyeOffLine size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-orange-600 to-amber-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-4 shadow-lg shadow-orange-900/25 ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'cursor-pointer hover:from-orange-500 hover:to-amber-600 active:scale-[0.98]'
                }`}
              >
                {isSubmitting
                  ? (isSignup ? "Registering..." : "Signing In...")
                  : (isSignup ? "Sign Up" : "Sign In")}
                {!isSubmitting && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                )}
              </button>

              <p className="text-sm text-center text-slate-600 mb-6">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(false)}
                      className="font-semibold text-orange-700 hover:text-orange-800 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(true)}
                      className="font-semibold text-orange-700 hover:text-orange-800 transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>

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
      </div>

      <footer className="relative z-10 bg-black/35 backdrop-blur-md border-t border-white/10 text-white/60 text-xs py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
            <span className="text-white/80">© 2026 PMAY · Ministry of Housing & Urban Affairs</span>
            <span className="hidden md:inline opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="hidden md:inline opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <span className="hidden md:inline opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            <span className="hidden md:inline opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">Accessibility Statement</a>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-white/80">Follow Us</span>
            <a target="_blank" rel="noreferrer" href="https://x.com/MoHUA_India" className="text-white/60 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a target="_blank" rel="noreferrer" href="https://www.youtube.com/@MoHUAIndia" className="text-white/60 hover:text-white transition-colors"><RiYoutubeFill size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
