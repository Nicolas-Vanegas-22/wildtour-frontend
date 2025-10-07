// Estados de aprobación para proveedores
export enum ProviderApprovalStatus {
  PENDING = 'pending',           // Esperando verificación
  APPROVED = 'approved',         // Aprobado y verificado
  REJECTED = 'rejected',         // Rechazado por información incorrecta
  SUSPENDED = 'suspended',       // Suspendido temporalmente
  UNDER_REVIEW = 'under_review'  // En proceso de revisión
}

export interface ProviderApproval {
  id: string;
  providerId: string;
  rnt: string;
  businessName: string;
  status: ProviderApprovalStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string; // ID del administrador supremo
  reviewNotes?: string;
  rejectionReason?: string;
  documents?: ProviderDocument[];
}

export interface ProviderDocument {
  id: string;
  type: 'rnt_certificate' | 'business_license' | 'tax_document' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  rnt: string;
  approvalStatus: ProviderApprovalStatus;
  verifiedAt?: string;
  canOperate: boolean; // Solo pueden operar si están aprobados
  lastStatusChange: string;
}

// Motivos comunes de rechazo
export const REJECTION_REASONS = [
  'RNT inválido o inexistente',
  'Documentos incompletos',
  'Información comercial incorrecta',
  'No cumple con los requisitos legales',
  'Documentos expirados',
  'Información inconsistente',
  'Empresa no registrada',
  'RNT suspendido por autoridades'
] as const;

export type RejectionReason = typeof REJECTION_REASONS[number];