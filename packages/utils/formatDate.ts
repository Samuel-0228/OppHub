import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date: string | Date, pattern: string = "PPP") => {
  return format(new Date(date), pattern);
};

export const timeAgo = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
