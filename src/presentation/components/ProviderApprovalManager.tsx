import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  Shield,
  Building,
  Calendar,
  User,
  Phone,
  Mail,
  Badge,
  Search,
  Filter,
  ChevronRight,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { ProviderApproval, ProviderApprovalStatus, REJECTION_REASONS } from '../../domain/models/ProviderApproval';

interface ProviderApprovalManagerProps {
  approvals: ProviderApproval[];
  onApprove: (approvalId: string, notes?: string) => void;
  onReject: (approvalId: string, reason: string, notes?: string) => void;
  onRequestMoreInfo: (approvalId: string, message: string) => void;
}

export default function ProviderApprovalManager({
  approvals,
  onApprove,
  onReject,
  onRequestMoreInfo
}: ProviderApprovalManagerProps) {
  const [selectedApproval, setSelectedApproval] = useState<ProviderApproval | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProviderApprovalStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para ejemplo
  const mockApprovals: ProviderApproval[] = [
    {
      id: '1',
      providerId: 'prov_123',
      rnt: 'RNT-98765432',
      businessName: 'Aventuras Tolima S.A.S',
      status: ProviderApprovalStatus.PENDING,
      submittedAt: '2023-12-15T10:30:00Z',
      documents: [
        {
          id: 'doc_1',
          type: 'rnt_certificate',
          name: 'Certificado_RNT_98765432.pdf',
          url: '/documents/cert_rnt.pdf',
          uploadedAt: '2023-12-15T10:30:00Z',
          verified: false
        },
        {
          id: 'doc_2',
          type: 'business_license',
          name: 'Licencia_Comercio_Tolima.pdf',
          url: '/documents/license.pdf',
          uploadedAt: '2023-12-15T10:30:00Z',
          verified: false
        }
      ]
    },
    {
      id: '2',
      providerId: 'prov_456',
      rnt: 'RNT-12345678',
      businessName: 'EcoTours Villa de Leyva',
      status: ProviderApprovalStatus.UNDER_REVIEW,
      submittedAt: '2023-12-14T15:20:00Z',
      reviewedBy: 'supreme_admin_001',
      reviewNotes: 'Revisando documentación adicional solicitada',
    },
    {
      id: '3',
      providerId: 'prov_789',
      rnt: 'RNT-55443322',
      businessName: 'Rafting Extremo Colombia',
      status: ProviderApprovalStatus.APPROVED,
      submittedAt: '2023-12-13T09:15:00Z',
      reviewedAt: '2023-12-13T14:30:00Z',
      reviewedBy: 'supreme_admin_001',
    }
  ];

  const getStatusColor = (status: ProviderApprovalStatus) => {
    switch (status) {
      case ProviderApprovalStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ProviderApprovalStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ProviderApprovalStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case ProviderApprovalStatus.SUSPENDED:
        return 'bg-red-100 text-red-800 border-red-200';
      case ProviderApprovalStatus.UNDER_REVIEW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status: ProviderApprovalStatus) => {
    switch (status) {
      case ProviderApprovalStatus.PENDING:
        return Clock;
      case ProviderApprovalStatus.APPROVED:
        return Check;
      case ProviderApprovalStatus.REJECTED:
      case ProviderApprovalStatus.SUSPENDED:
        return X;
      case ProviderApprovalStatus.UNDER_REVIEW:
        return Eye;
      default:
        return AlertTriangle;
    }
  };

  const getStatusLabel = (status: ProviderApprovalStatus) => {
    switch (status) {
      case ProviderApprovalStatus.PENDING:
        return 'Pendiente';
      case ProviderApprovalStatus.APPROVED:
        return 'Aprobado';
      case ProviderApprovalStatus.REJECTED:
        return 'Rechazado';
      case ProviderApprovalStatus.SUSPENDED:
        return 'Suspendido';
      case ProviderApprovalStatus.UNDER_REVIEW:
        return 'En Revisión';
      default:
        return 'Desconocido';
    }
  };

  const filteredApprovals = mockApprovals.filter(approval => {
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      approval.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.rnt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = () => {
    if (selectedApproval) {
      onApprove(selectedApproval.id, reviewNotes);
      setShowApproveModal(false);
      setSelectedApproval(null);
      setReviewNotes('');
    }
  };

  const handleReject = () => {
    if (selectedApproval && rejectionReason) {
      onReject(selectedApproval.id, rejectionReason, reviewNotes);
      setShowRejectModal(false);
      setSelectedApproval(null);
      setRejectionReason('');
      setReviewNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Pendientes</p>
              <p className="text-xl font-bold text-neutral-900">
                {mockApprovals.filter(a => a.status === ProviderApprovalStatus.PENDING).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">En Revisión</p>
              <p className="text-xl font-bold text-neutral-900">
                {mockApprovals.filter(a => a.status === ProviderApprovalStatus.UNDER_REVIEW).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Aprobados</p>
              <p className="text-xl font-bold text-neutral-900">
                {mockApprovals.filter(a => a.status === ProviderApprovalStatus.APPROVED).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Rechazados</p>
              <p className="text-xl font-bold text-neutral-900">
                {mockApprovals.filter(a => a.status === ProviderApprovalStatus.REJECTED).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg p-4 border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de empresa o RNT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProviderApprovalStatus | 'all')}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los estados</option>
            <option value={ProviderApprovalStatus.PENDING}>Pendientes</option>
            <option value={ProviderApprovalStatus.UNDER_REVIEW}>En Revisión</option>
            <option value={ProviderApprovalStatus.APPROVED}>Aprobados</option>
            <option value={ProviderApprovalStatus.REJECTED}>Rechazados</option>
          </select>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {filteredApprovals.map((approval) => {
            const StatusIcon = getStatusIcon(approval.status);
            return (
              <div key={approval.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{approval.businessName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Badge className="w-4 h-4" />
                          {approval.rnt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(approval.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(approval.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {getStatusLabel(approval.status)}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApproval(approval)}
                      className="flex items-center gap-1"
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {approval.status === ProviderApprovalStatus.PENDING && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApproval(approval);
                        setShowApproveModal(true);
                      }}
                      className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApproval(approval);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Solicitar info
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de aprobación */}
      <AnimatePresence>
        {showApproveModal && selectedApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Aprobar Proveedor</h3>
                  <p className="text-sm text-neutral-600">{selectedApproval.businessName}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notas de aprobación (opcional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Agregar comentarios sobre la verificación..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowApproveModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Aprobar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de rechazo */}
      <AnimatePresence>
        {showRejectModal && selectedApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Rechazar Proveedor</h3>
                  <p className="text-sm text-neutral-600">{selectedApproval.businessName}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Motivo del rechazo *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Seleccionar motivo</option>
                  {REJECTION_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Comentarios adicionales
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Explicar el motivo del rechazo en detalle..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRejectModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Rechazar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}