import React, { useState } from 'react';
import ServiceStatusBadge from './ServiceStatusBadge';

export default function ServiceList({ services = [], selected = [], onToggle, statuses = {}, onDelete }) {
  const [deletingService, setDeletingService] = useState(null);

  if (services.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        No services detected
      </div>
    );
  }

  const handleDelete = async (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;
    const confirmed = window.confirm(`Are you sure you want to delete microservice "${name}" and all its historical telemetry?`);
    if (!confirmed) return;

    try {
      setDeletingService(name);
      await onDelete(name);
    } finally {
      setDeletingService(null);
    }
  };

  return (
    <div className="space-y-2">
      {services.map((svc) => {
        const name = typeof svc === 'string' ? svc : svc.serviceName;
        const isChecked = selected.includes(name);

        let status = 'down';
        if (statuses && statuses[name] !== undefined) {
          status = statuses[name];
        } else if (svc && typeof svc === 'object' && Array.isArray(svc.instances) && svc.instances.length > 0) {
          status = svc.instances.some((i) => i.status === 'up') ? 'up' : 'down';
        }

        const isDown = status === 'down';
        const isDeleting = deletingService === name;

        return (
          <div
            key={name}
            onClick={() => onToggle(name)}
            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-200 group ${
              isChecked
                ? isDown
                  ? 'bg-rose-950/20 border-rose-500/50 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : 'bg-[#18191d] border-indigo-500/60 text-[#f8fafc] shadow-[0_0_15px_rgba(99,102,241,0.12)]'
                : isDown
                ? 'bg-[#0b0c0e] border-rose-950/40 text-[#94a3b8] hover:border-rose-900/60'
                : 'bg-[#0b0c0e] border-[#22242a] text-[#94a3b8] hover:border-[#2e3038]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded bg-[#0b0c0e] border-[#22242a] accent-indigo-500 focus:ring-0 cursor-pointer"
              />
              <span className={`font-mono text-xs font-medium truncate ${isDown ? 'text-[#94a3b8]' : 'text-[#f8fafc]'}`}>
                {name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ServiceStatusBadge status={status} />
              {onDelete && (
                <button
                  type="button"
                  title={`Delete ${name}`}
                  disabled={isDeleting}
                  onClick={(e) => handleDelete(e, name)}
                  className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity p-1 text-[#64748b] hover:text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
