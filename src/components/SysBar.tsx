"use client";

import { useState, useEffect } from "react";
import { IconWifi } from "@/components/icons";

export function SysBar() {
  const [time, setTime] = useState("14:32");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sysbar">
      <span>{time}</span>
      <span className="sysbar-r">
        <IconWifi size={15} />
        <span>84%</span>
        <svg width={20} height={11} viewBox="0 0 26 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="#fff" strokeOpacity="0.5" />
          <rect x="2" y="2" width="16" height="9" rx="1.5" fill="#fff" />
          <rect x="24" y="4" width="2" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
