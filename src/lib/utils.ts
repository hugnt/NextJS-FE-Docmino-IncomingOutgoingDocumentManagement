/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { endOfMonth, format, isEqual, parseISO, startOfMonth } from "date-fns"
import { toaster } from "@/components/dialog/toaster"
import envConfig from "@/config/config"
import { PATH } from "@/constants/paths"
import { Token } from "@/types/User"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const handleErrorApi = ({ errors, duration }: {
  errors: any,
  duration?: number
}) => {
  if (Array.isArray(errors)) {
    for (let i = 0; i < errors.length; i++) {
      toaster.error({
        title: 'Error',
        message: errors[i] ?? "Undefined Error",
      }, {
        position: "bottom-right",
        autoClose: duration ?? 2000
      })
    }
  }
  else {
    toaster.error({
      title: 'Uncontroled Error',
      message: errors ?? "Undefined Error",
    }, {
      position: "bottom-right",
      autoClose: duration ?? 2000
    })
  }
}

export const handleSuccessApi = ({ title, message, duration }: {
  title?: string,
  message?: string,
  duration?: number
}) => {
  toaster.success({
    title: title ?? "Process Completed",
    message: message ?? "Process Completed"
  }, {
    position: "bottom-right",
    autoClose: duration ?? 2000
  })
}

export const handleError = ({ title, message, duration }: {
  title?: string,
  message?: string,
  duration?: number
}) => {
  toaster.error({
    title: title ?? "Error",
    message: message ?? "Process Error"
  }, {
    position: "bottom-right",
    autoClose: duration ?? 2000
  })
}

export const isLoginPage = () => window.location.pathname == PATH.Login || window.location.pathname == PATH.Register;

export const setClientToken = (token: Token) => {
  if (typeof window === "undefined") return; // Ensure this runs only on the client
  localStorage.setItem(envConfig.NEXT_PUBLIC_API_ENDPOINT, JSON.stringify(token));
}

export const getClientToken = (): Token | null => {
  if (typeof window === "undefined") return null; // Ensure this runs only on the client
  const token = localStorage.getItem(envConfig.NEXT_PUBLIC_API_ENDPOINT);
  return token ? JSON.parse(token) as Token : null;
};

export const removeClientToken = () => {
  if (typeof window === "undefined") return; // Ensure this runs only on the client
  localStorage.removeItem(envConfig.NEXT_PUBLIC_API_ENDPOINT);
};

export const getAccessToken = (): string | null => {
  const token = getClientToken();
  return token?.accessToken ?? null;
};

export const getRefreshToken = (): string | null => {
  const token = getClientToken();
  return token?.refreshToken ?? null;
};

export const getInitials = (fullName: string): string => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};


export const getDatePlus = (date: Date, plusNumber: number): Date => {
  date.setDate(date.getDate() + plusNumber);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getMaxDate = (date1: Date, date2: Date): Date => {
  return new Date(Math.max(date1.getTime(), date2.getTime()))
};

export const getMaxDateString = (date1: Date, date2: Date): string => {
  return format(new Date(Math.max(date1.getTime(), date2.getTime())), "yyyy-MM-dd")
};



// Helper function to safely format dates
export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "N/A"

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString
    return format(date, "MM/dd/yyyy")
  } catch {
    return "Invalid date"
  }
}

// Helper function to check if dates are different
export const areDifferentDates = (date1: string | Date | null | undefined, date2: string | Date | null | undefined) => {
  if (!date1 || !date2) return false

  try {
    const d1 = typeof date1 === "string" ? parseISO(date1) : date1
    const d2 = typeof date2 === "string" ? parseISO(date2) : date2
    return !isEqual(d1, d2)
  } catch {
    return false
  }
}


export function getMonthRange(date: Date): { start: string; end: string } {
  const startDate = startOfMonth(date)
  const endDate = endOfMonth(date)

  return {
    start: format(startDate, 'yyyy-MM-dd'),
    end: format(endDate, 'yyyy-MM-dd'),
  }
}
