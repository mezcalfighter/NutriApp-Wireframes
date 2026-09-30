import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Plus, Heart, MessageCircle, MoreVertical, AlertCircle, Info, X, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ReportContent from './ReportContent';
import { toast } from 'sonner';

interface SocialFeedProps {
  role: 'nutritionist' | 'patient';
}

interface Post {
  id: string;
  nutritionist_id: string;
  nutritionist_name: string;
  credential: string;
  avatar_url?: string;
  text: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  is_hidden: boolean;
  created_at: string;
  is_liked?: boolean;
}

export default function SocialFeed({ role }: SocialFeedProps) {
  const navigate = useNavigate();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState<string | null>(null);

  // Mock current user ID (would come from auth context in real app)
  const currentUserId = 'nutritionist-1';

  // Mock posts data - filter out hidden posts
  const [allPosts, setAllPosts] = useState<Post[]>([
    {
      id: 'POST-2026-1234',
      nutritionist_id: 'nutritionist-1',
      nutritionist_name: 'Dra. María González',
      credential: 'Lic. en Nutrición',
      text: '🥑 Tip del día: El aguacate es rico en grasas saludables que ayudan a la absorción de vitaminas liposolubles. ¡Agrégalo a tus ensaladas para maximizar los nutrientes!',
      image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=450&fit=crop',
      likes_count: 24,
      comments_count: 5,
      is_hidden: false,
      created_at: '2026-04-19T10:30:00Z',
      is_liked: false,
    },
    {
      id: 'POST-2026-5678',
      nutritionist_id: 'nutritionist-2',
      nutritionist_name: 'Dr. Carlos Ramírez',
      credential: 'Mtro. en Nutrición Deportiva',
      text: '💪 ¿Sabías que consumir proteína dentro de los 30 minutos después del ejercicio ayuda a la recuperación muscular? Opta por opciones naturales como yogurt griego, huevo o pollo.',
      likes_count: 18,
      comments_count: 3,
      is_hidden: false,
      created_at: '2026-04-18T16:45:00Z',
      is_liked: true,
    },
    {
      id: 'POST-2026-9012',
      nutritionist_id: 'nutritionist-3',
      nutritionist_name: 'Lic. Ana Martínez',
      credential: 'Especialista en Nutrición Clínica',
      text: 'Receta saludable: Smoothie verde energizante\n\n🍃 1 taza de espinaca\n🍌 1 plátano\n🥛 1 taza de leche de almendra\n🥜 1 cucharada de mantequilla de almendra\n\nLicúa todo y disfruta de un desayuno nutritivo en minutos.',
      image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&h=450&fit=crop',
      likes_count: 32,
      comments_count: 8,
      is_hidden: false,
      created_at: '2026-04-17T09:15:00Z',
      is_liked: false,
    },
    {
      id: 'POST-2026-3456',
      nutritionist_id: 'nutritionist-1',
      nutritionist_name: 'Dra. María González',
      credential: 'Lic. en Nutrición',
      text: 'Esta publicación ha sido ocultada por el administrador.',
      likes_count: 5,
      comments_count: 2,
      is_hidden: true,
      hidden_by_admin: true,
      created_at: '2026-04-16T11:00:00Z',
      is_liked: false,
    },
  ]);

  // Only show non-hidden posts
  const posts = allPosts.filter(post => !post.is_hidden);

  const handleLike = (postId: string) => {
    setAllPosts(allPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          is_liked: !post.is_liked,
          likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
        };
      }
      return post;
    }));
  };

  const handleDelete = (postId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      setAllPosts(allPosts.filter(post => post.id !== postId));
      toast.success('Publicación eliminada');
    }
  };

  const handleReport = (postId: string) => {
    setSelectedPostForReport(postId);
    setShowReportDialog(true);
  };

  const handleReportSubmit = () => {
    setShowReportDialog(false);
    setSelectedPostForReport(null);
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
    return text.substring(0, maxLength);
  };

  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title={role === 'patient' ? 'Feed Social' : 'Feed Social'} showBack />

      <div className="p-4 space-y-4">
        {/* Info Banner */}
        {!bannerDismissed && (
          <Alert className={`relative ${role === 'nutritionist' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
            {role === 'nutritionist' ? (
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
            <AlertDescription className={role === 'nutritionist' ? 'text-blue-900 dark:text-blue-100' : 'text-amber-900 dark:text-amber-100'}>
              {role === 'nutritionist'
                ? 'El contenido que publiques es de tu exclusiva responsabilidad como profesionista. NutriApp no verifica ni avala las publicaciones.'
                : 'El contenido publicado aquí es responsabilidad exclusiva de cada nutriólogo. Si identificas algo inapropiado, usa "Reportar contenido".'}
            </AlertDescription>
            <button
              onClick={() => setBannerDismissed(true)}
              className="absolute top-3 right-3 text-current opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {role === 'patient'
                  ? 'Aún no hay publicaciones de tu nutriólogo.'
                  : 'Aún no has publicado contenido para tus pacientes.'}
              </p>
            </div>
          ) : (
            posts.map(post => {
              const isExpanded = expandedPosts.has(post.id);
              const needsTruncation = post.text.length > 150;
              const displayText = isExpanded ? post.text : truncateText(post.text);

              return (
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

                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <MoreVertical className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900">
                            {role === 'nutritionist' && post.nutritionist_id === currentUserId ? (
                              <>
                                <DropdownMenuItem
                                  onClick={() => navigate(`/nutritionist/community/edit/${post.id}`)}
                                  className="text-slate-700 dark:text-slate-300"
                                >
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(post.id)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  Eliminar
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleReport(post.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                Reportar contenido
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {displayText}
                      {needsTruncation && !isExpanded && '...'}
                    </p>
                    {needsTruncation && (
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1"
                      >
                        {isExpanded ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
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

                  {/* Post Actions */}
                  <div className="px-4 pb-4 flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 ${
                        post.is_liked
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
                      } transition-colors`}
                    >
                      <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes_count}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/${role}/community/post/${post.id}`)}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FAB for Nutritionist */}
      {role === 'nutritionist' && (
        <button
          onClick={() => navigate('/nutritionist/community/create')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Report Dialog */}
      {showReportDialog && selectedPostForReport && (
        <ReportContent
          contentType="post"
          contentId={selectedPostForReport}
          onClose={() => {
            setShowReportDialog(false);
            setSelectedPostForReport(null);
          }}
          onSubmit={handleReportSubmit}
        />
      )}

      <MobileNav role={role} />
    </div>
  );
}
