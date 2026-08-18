export interface SLARiskStatus {
  status: 'on_track' | 'warning' | 'critical' | 'breached';
  hours_remaining: number;
  minutes_remaining: number;
  seconds_remaining: number;
  formatted_time: string;
  is_breached: boolean;
}

export function calculateSLARisk(deadlineISO?: string): SLARiskStatus {
  if (!deadlineISO) {
    return {
      status: 'on_track',
      hours_remaining: 48,
      minutes_remaining: 0,
      seconds_remaining: 0,
      formatted_time: '48h 00m',
      is_breached: false,
    };
  }

  const now = new Date().getTime();
  const deadline = new Date(deadlineISO).getTime();
  const diffMs = deadline - now;

  if (diffMs <= 0) {
    const pastMs = Math.abs(diffMs);
    const hrs = Math.floor(pastMs / (1000 * 60 * 60));
    const mins = Math.floor((pastMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      status: 'breached',
      hours_remaining: -hrs,
      minutes_remaining: -mins,
      seconds_remaining: 0,
      formatted_time: `Breached by ${hrs}h ${mins}m`,
      is_breached: true,
    };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  let status: SLARiskStatus['status'] = 'on_track';
  if (hrs < 4) {
    status = 'critical';
  } else if (hrs < 12) {
    status = 'warning';
  }

  const formatted = hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;

  return {
    status,
    hours_remaining: hrs,
    minutes_remaining: mins,
    seconds_remaining: secs,
    formatted_time: formatted,
    is_breached: false,
  };
}
