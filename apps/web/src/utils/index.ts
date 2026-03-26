import { format } from 'date-fns';

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
