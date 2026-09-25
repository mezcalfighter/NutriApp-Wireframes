import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Mail, MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';

interface ContactTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactTicket({ open, onOpenChange }: ContactTicketProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: 'Consulta general' },
    { value: 'technical', label: 'Problema técnico' },
    { value: 'billing', label: 'Facturación y pagos' },
    { value: 'account', label: 'Mi cuenta' },
    { value: 'feature', label: 'Solicitud de funcionalidad' },
    { value: 'other', label: 'Otro' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Ticket creado exitosamente. Te contactaremos pronto por email.');
    setSubmitting(false);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            Contacto y Soporte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Alert */}
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              <p className="text-sm">
                Nuestro equipo te responderá en un plazo máximo de 24 horas hábiles.
                Para problemas urgentes, marca al +52 (55) 1234-5678.
              </p>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                Asunto *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                placeholder="Describe brevemente tu consulta"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                Mensaje *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white resize-none"
                placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                rows={6}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Enviar ticket'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p>
              También puedes escribirnos directamente a{' '}
              <a href="mailto:soporte@nutriapp.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                soporte@nutriapp.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
