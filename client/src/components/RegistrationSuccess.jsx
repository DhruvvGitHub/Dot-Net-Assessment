import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCheckLine, RiFileList3Line } from '@remixicon/react';

const RegistrationSuccess = ({ successData, resetForm }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-[440px] xl:w-[460px] flex flex-col justify-center">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] p-8 md:p-9 text-slate-800 border border-white/60 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
          <RiCheckLine size={32} />
        </div>
        
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Registration Submitted</h2>
        <p className="text-sm text-slate-500 mb-8">
          Your application for Pradhan Mantri Awas Yojana is under review.
        </p>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 text-left p-5 mb-8 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 text-slate-900 pointer-events-none">
            <RiFileList3Line size={64} />
          </div>
          <div className="relative z-10 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Registration ID</p>
              <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">{successData.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                {successData.status}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs font-medium text-slate-500 mb-8 bg-orange-50 text-orange-800 p-3 rounded-xl border border-orange-100">
          Please save your Registration ID. You will need it to check your application status later.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate(`/status/${successData.id}`)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Check Status Now
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-[0.98]"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
