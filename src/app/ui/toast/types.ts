export enum ToastSeverity {
  success,
  error, 
  warning
};

export interface Toast {
  id: string;            
  message: string;
  severity: ToastSeverity;
  duration: number;       
}