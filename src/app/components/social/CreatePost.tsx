import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';

export default function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const maxChars = 500;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handlePublish = () => {
    if (!text.trim()) {
      toast.error('Debes escribir algo antes de publicar');
      return;
    }

    // In a real app, this would save to the backend
    console.log('Publishing post:', { text, image });

    toast.success('Publicación enviada');
    navigate('/nutritionist/community');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Nueva Publicación" showBack />

      <div className="p-4 space-y-4">
        {/* Warning Banner */}
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            El contenido que publiques es de tu exclusiva responsabilidad como profesionista
            registrado. NutriApp no verifica ni avala las publicaciones. El incumplimiento de los
            Términos de Uso puede resultar en la suspensión de tu cuenta.
          </AlertDescription>
        </Alert>

        {/* Text Input */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comparte un tip, receta o recurso..."
            maxLength={maxChars}
            rows={8}
            className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
          />

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <span
              className={`text-sm ${
                text.length >= maxChars
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {text.length}/{maxChars}
            </span>

            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {image ? 'Cambiar imagen' : 'Adjuntar imagen'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="relative">
              <img
                src={image}
                alt="Preview"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => navigate('/nutritionist/community')}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
