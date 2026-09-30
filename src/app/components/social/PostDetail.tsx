import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import { Heart, MoreVertical, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ReportContent from './ReportContent';
import { toast } from 'sonner';

interface PostDetailProps {
  role: 'nutritionist' | 'patient';
}

interface Comment {
  id: string;
  author_id: string;
  author_name: string;
  author_role: 'nutritionist' | 'patient';
  text: string;
  created_at: string;
}

interface Post {
  id: string;
  nutritionist_id: string;
  nutritionist_name: string;
  credential: string;
  text: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked?: boolean;
}

export default function PostDetail({ role }: PostDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedCommentForReport, setSelectedCommentForReport] = useState<string | null>(null);

  // Mock current user
  const currentUserId = role === 'nutritionist' ? 'nutritionist-1' : 'patient-1';

  // Mock post data
  const [post, setPost] = useState<Post>({
    id: '1',
    nutritionist_id: 'nutritionist-1',
    nutritionist_name: 'Dra. María González',
    credential: 'Lic. en Nutrición',
    text: '🥑 Tip del día: El aguacate es rico en grasas saludables que ayudan a la absorción de vitaminas liposolubles. ¡Agrégalo a tus ensaladas para maximizar los nutrientes!',
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=450&fit=crop',
    likes_count: 24,
    comments_count: 5,
    created_at: '2026-04-19T10:30:00Z',
    is_liked: false,
  });

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author_id: 'patient-2',
      author_name: 'Juan Pérez',
      author_role: 'patient',
      text: '¡Excelente consejo! Lo voy a aplicar en mis comidas.',
      created_at: '2026-04-19T11:15:00Z',
    },
    {
      id: '2',
      author_id: 'nutritionist-2',
      author_name: 'Dr. Carlos Ramírez',
      author_role: 'nutritionist',
      text: 'Muy buen punto. También es importante recordar que el aguacate aporta fibra y potasio.',
      created_at: '2026-04-19T13:20:00Z',
    },
    {
      id: '3',
      author_id: 'patient-3',
      author_name: 'Ana Martínez',
      author_role: 'patient',
      text: '¿Cuántas veces a la semana se recomienda consumir aguacate?',
      created_at: '2026-04-19T15:45:00Z',
    },
  ]);

  const handleLike = () => {
    setPost({
      ...post,
      is_liked: !post.is_liked,
      likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
    });
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author_id: currentUserId,
      author_name: role === 'nutritionist' ? 'Yo' : 'Tú',
      author_role: role,
      text: commentText,
      created_at: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setPost({ ...post, comments_count: post.comments_count + 1 });
    setCommentText('');
    toast.success('Comentario publicado');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      setComments(comments.filter(c => c.id !== commentId));
      setPost({ ...post, comments_count: post.comments_count - 1 });
      toast.success('Comentario eliminado');
    }
  };

  const handleReportComment = (commentId: string) => {
    setSelectedCommentForReport(commentId);
    setShowReportDialog(true);
  };

  const handleReportSubmit = () => {
    setShowReportDialog(false);
    setSelectedCommentForReport(null);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Header title="Publicación" showBack />

      <div className="p-4 space-y-4">
        {/* Post Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {post.nutritionist_name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 dark:text-white font-medium">
                {post.nutritionist_name}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs">
                  {post.credential}
                </span>
                <span>•</span>
                <span>{getRelativeTime(post.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.text}</p>
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
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                post.is_liked
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
              } transition-colors`}
            >
              <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-900 dark:text-white font-semibold">
              Comentarios ({comments.length})
            </h3>
          </div>

          {/* Comments List */}
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {comments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              </div>
            ) : (
              comments.map(comment => {
                const isOwnComment =
                  (role === 'nutritionist' && comment.author_role === 'nutritionist' && comment.author_id === currentUserId) ||
                  (role === 'patient' && comment.author_role === 'patient' && comment.author_id === currentUserId);

                return (
                  <div key={comment.id} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        {comment.author_name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 dark:text-white font-medium text-sm">
                              {comment.author_name}
                            </span>
                            {comment.author_role === 'nutritionist' && (
                              <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs">
                                Nutriólogo
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {getRelativeTime(comment.created_at)}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <MoreVertical className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900">
                            {isOwnComment ? (
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                Eliminar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleReportComment(comment.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                Reportar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="Escribe un comentario..."
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            onClick={handleSendComment}
            disabled={!commentText.trim()}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>

      {/* Report Dialog */}
      {showReportDialog && selectedCommentForReport && (
        <ReportContent
          contentType="comment"
          contentId={selectedCommentForReport}
          onClose={() => {
            setShowReportDialog(false);
            setSelectedCommentForReport(null);
          }}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}
