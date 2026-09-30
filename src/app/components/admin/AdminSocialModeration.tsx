import { useState } from 'react';
import Header from '../shared/Header';
import { EyeOff, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  nutritionist_id: string;
  nutritionist_name: string;
  credential: string;
  text: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  is_hidden: boolean;
  hidden_by_admin: boolean;
  created_at: string;
}

export default function AdminSocialModeration() {
  const [selectedNutritionist, setSelectedNutritionist] = useState('all');

  // Mock nutritionists list
  const nutritionists = [
    { id: 'nutritionist-1', name: 'Dra. María González' },
    { id: 'nutritionist-2', name: 'Dr. Carlos Ramírez' },
    { id: 'nutritionist-3', name: 'Lic. Ana Martínez' },
  ];

  // Mock posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      nutritionist_id: 'nutritionist-1',
      nutritionist_name: 'Dra. María González',
      credential: 'Lic. en Nutrición',
      text: '🥑 Tip del día: El aguacate es rico en grasas saludables que ayudan a la absorción de vitaminas liposolubles. ¡Agrégalo a tus ensaladas para maximizar los nutrientes!',
      image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=450&fit=crop',
      likes_count: 24,
      comments_count: 5,
      is_hidden: false,
      hidden_by_admin: false,
      created_at: '2026-04-19T10:30:00Z',
    },
    {
      id: '2',
      nutritionist_id: 'nutritionist-2',
      nutritionist_name: 'Dr. Carlos Ramírez',
      credential: 'Mtro. en Nutrición Deportiva',
      text: '💪 ¿Sabías que consumir proteína dentro de los 30 minutos después del ejercicio ayuda a la recuperación muscular? Opta por opciones naturales como yogurt griego, huevo o pollo.',
      likes_count: 18,
      comments_count: 3,
      is_hidden: false,
      hidden_by_admin: false,
      created_at: '2026-04-18T16:45:00Z',
    },
    {
      id: '3',
      nutritionist_id: 'nutritionist-3',
      nutritionist_name: 'Lic. Ana Martínez',
      credential: 'Especialista en Nutrición Clínica',
      text: 'Receta saludable: Smoothie verde energizante\n\n🍃 1 taza de espinaca\n🍌 1 plátano\n🥛 1 taza de leche de almendra\n🥜 1 cucharada de mantequilla de almendra\n\nLicúa todo y disfruta de un desayuno nutritivo en minutos.',
      image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&h=450&fit=crop',
      likes_count: 32,
      comments_count: 8,
      is_hidden: true,
      hidden_by_admin: true,
      created_at: '2026-04-17T09:15:00Z',
    },
  ]);

  // Only show active (non-hidden) posts in moderation view
  const filteredPosts = (selectedNutritionist === 'all'
    ? posts
    : posts.filter(post => post.nutritionist_id === selectedNutritionist)
  ).filter(post => !post.is_hidden);

  const allPostsForNutritionist = selectedNutritionist === 'all'
    ? posts
    : posts.filter(post => post.nutritionist_id === selectedNutritionist);

  const activeCount = allPostsForNutritionist.filter(p => !p.is_hidden).length;
  const hiddenCount = allPostsForNutritionist.filter(p => p.is_hidden).length;

  const handleToggleVisibility = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newHiddenState = !post.is_hidden;
        toast.success(newHiddenState ? 'Publicación ocultada' : 'Publicación restaurada');
        return {
          ...post,
          is_hidden: newHiddenState,
          hidden_by_admin: newHiddenState,
        };
      }
      return post;
    }));
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} d`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Moderación de Contenido" showBack />

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Filter Dropdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-medium">
            Ver publicaciones de:
          </label>
          <select
            value={selectedNutritionist}
            onChange={(e) => setSelectedNutritionist(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          >
            <option value="all">Todos los nutriólogos</option>
            {nutritionists.map(nut => (
              <option key={nut.id} value={nut.id}>
                {nut.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Counter */}
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </span>{' '}
            publicaciones activas
          </span>
          <span>•</span>
          <span>
            <span className="font-semibold text-red-600 dark:text-red-400">{hiddenCount}</span>{' '}
            ocultas
          </span>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedNutritionist === 'all'
                  ? 'No hay publicaciones en el sistema.'
                  : 'Este nutriólogo no tiene publicaciones.'}
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {post.nutritionist_name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium">
                          {post.nutritionist_name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs">
                            {post.credential}
                          </span>
                          <span>•</span>
                          <span>{getRelativeTime(post.created_at)}</span>
                          <span>•</span>
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{post.id}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleVisibility(post.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <EyeOff className="w-4 h-4" />
                        Ocultar publicación
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {truncateText(post.text)}
                  </p>
                </div>

                {/* Post Image */}
                {post.image_url && (
                  <div className="px-4 pb-3">
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full rounded-lg object-cover"
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                )}

                {/* Post Stats */}
                <div className="px-4 pb-4 flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <span>{post.likes_count} me gusta</span>
                  <span>•</span>
                  <span>{post.comments_count} comentarios</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
