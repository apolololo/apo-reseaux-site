
import * as React from "react";

type ToastActionElement = React.ReactElement;

type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toasts = new Map<string, ToasterToast>();

const listeners: Array<(toasts: ToasterToast[]) => void> = [];

function dispatch() {
  const entries = Array.from(toasts.values());
  listeners.forEach((listener) => {
    listener(entries);
  });
}

function toast({ ...props }: ToastProps) {
  const id = props.id || genId();

  toasts.set(id, {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        dismiss(id);
      }
    },
  });
  dispatch();
  return id;
}

function dismiss(toastId?: string) {
  if (toastId) {
    toasts.delete(toastId);
  } else {
    toasts.clear();
  }
  dispatch();
}

function useToast() {
  const [toastEntries, setToastEntries] = React.useState<ToasterToast[]>([]);

  React.useEffect(() => {
    listeners.push(setToastEntries);
    return () => {
      const index = listeners.indexOf(setToastEntries);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: toastEntries,
    toast,
    dismiss,
  };
}

export { useToast, toast };
