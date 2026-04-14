"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

type AlertItem = {
  id: string;
  text: string;
  createdAt: string;
};

type NotificationBellProps = {
  alerts: AlertItem[];
};

export default function NotificationBell({ alerts }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const topAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)]"
      >
        <Bell size={16} />
      </button>
      {topAlerts.length > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D48806] text-white text-[10px] flex items-center justify-center">
          {topAlerts.length}
        </span>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 mt-3 w-[320px] max-w-[90vw] z-20 bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_18px_44px_rgba(26,22,16,0.12)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#EAE6DF] bg-[#FCFAF8]">
              <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)]">System Alerts</div>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {topAlerts.length === 0 ? (
                <div className="px-4 py-6 text-[0.84rem] text-[var(--color-text-muted)]">No alerts yet.</div>
              ) : (
                topAlerts.map((alert) => (
                  <div key={alert.id} className="px-4 py-3 border-b last:border-b-0 border-[#F1EEE8]">
                    <div className="text-[0.84rem] text-[var(--color-text)]">{alert.text}</div>
                    <div className="text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)] mt-1">
                      {new Date(alert.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
