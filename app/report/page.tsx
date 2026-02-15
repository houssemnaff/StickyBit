'use client'
import { useState, useEffect } from "react";
import { Users, AlertTriangle, ThumbsUp, Clock, TrendingUp, Plus } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { supabase } from "@/lib/supabase";

interface ScamReport {
  id: number;
  type: string;
  title: string;
  description: string;
  upvotes: number;
  time: string;
  verified: boolean;
  user_id?: string;
  created_at?: string;
}

interface Comment {
  id: number;
  report_id: number;
  user_id: string;
  content: string;
  created_at: string;
}

const initialReports: ScamReport[] = [
  {
    id: 1, type: "SMS", title: "رسالة مزيفة من البريد التونسي",
    description: "وصلتني رسالة تقول ربحت جائزة وتطلب مني أرقام بطاقتي البنكية. الرابط مشبوه.",
    upvotes: 45, time: "منذ ساعة", verified: true,
  },
  {
    id: 2, type: "فيسبوك", title: "بائع محتال في Marketplace",
    description: "بائع يعرض iPhone بسعر رخيص جداً ويطلب دفع مسبق عبر مندوبية. حساب جديد بدون تاريخ.",
    upvotes: 32, time: "منذ 3 ساعات", verified: true,
  },
  {
    id: 3, type: "واتساب", title: "طلب كود التحقق",
    description: "شخص يدّعي أنه صديقي وطلب مني كود وصل على تلفوني. اتضح أنه محاولة سرقة حسابي.",
    upvotes: 28, time: "منذ 5 ساعات", verified: false,
  },
  {
    id: 4, type: "إيميل", title: "إيميل مزيف من STEG",
    description: "إيميل يقول فاتورتي غير مدفوعة ويطلب الدفع عبر رابط. الإيميل مش من العنوان الرسمي.",
    upvotes: 19, time: "منذ يوم", verified: true,
  },
];

const CommunityAlerts = () => {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("SMS");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  // Initialiser l'utilisateur
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', newId);
      setUserId(newId);
    }
  }, []);

  // Charger les rapports de Supabase
  useEffect(() => {
    if (userId) {
      fetchReports();
      checkCanSubmit();
    }
  }, [userId]);

  const checkCanSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('scam_reports')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .limit(1);
      
      if (error) throw error;
      setCanSubmit(!data || data.length === 0);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scam_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReports(data || []);
      
      // Charger les commentaires pour tous les rapports
      if (data && data.length > 0) {
        fetchAllComments(data.map(r => r.id));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      setReports(initialReports);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async (reportIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .in('report_id', reportIds)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const commentsMap: { [key: number]: Comment[] } = {};
      data?.forEach(comment => {
        if (!commentsMap[comment.report_id]) {
          commentsMap[comment.report_id] = [];
        }
        commentsMap[comment.report_id].push(comment);
      });
      setComments(commentsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const handleUpvote = async (id: number) => {
    try {
      const report = reports.find(r => r.id === id);
      if (!report) return;

      const { error } = await supabase
        .from('scam_reports')
        .update({ upvotes: report.upvotes + 1 })
        .eq('id', id);
      
      if (error) throw error;
      
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleSubmit = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    if (!canSubmit) {
      alert('يمكنك إضافة بلاغ واحد فقط يومياً');
      return;
    }
    
    try {
      const newReport = {
        type: newType,
        title: newTitle,
        description: newDesc,
        upvotes: 0,
        verified: false,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from('scam_reports')
        .insert([newReport])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setReports((prev) => [data[0], ...prev]);
        setComments((prev) => ({ ...prev, [data[0].id]: [] }));
      }
      
      setNewTitle("");
      setNewDesc("");
      setShowForm(false);
      setCanSubmit(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du rapport:', error);
      alert('Erreur lors de l\'envoi du rapport. Veuillez réessayer.');
    }
  };

  const handleAddComment = async (reportId: number) => {
    const content = newComments[reportId]?.trim();
    if (!content) return;

    try {
      const newComment = {
        report_id: reportId,
        user_id: userId,
        content: content,
      };

      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setComments((prev) => ({
          ...prev,
          [reportId]: [...(prev[reportId] || []), data[0]],
        }));
        setNewComments((prev) => ({ ...prev, [reportId]: '' }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-blue/20">
              <Users className="h-6 w-6 text-cyber-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">فضاء تنبيهات المجتمع</h1>
              <p className="text-xs text-muted-foreground">شارك وبلّغ عن محاولات الاحتيال</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!canSubmit}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              canSubmit
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Plus className="h-4 w-4" />
            {canSubmit ? 'بلّغ عن احتيال' : 'عدت الغد'}
          </button>
        </div>

        {/* Trending */}
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            الأكثر انتشاراً اليوم
          </h3>
          <p className="text-sm text-muted-foreground">
            ⚠️ رسائل مزيفة من البريد التونسي تنتشر بكثرة - كن حذراً!
          </p>
        </div>

        {/* New report form */}
        {showForm && (
          <div className="mb-8 animate-fade-in-up rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-bold text-foreground">بلّغ عن محاولة احتيال</h3>
            <div className="space-y-4">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="SMS">SMS</option>
                <option value="واتساب">واتساب</option>
                <option value="فيسبوك">فيسبوك</option>
                <option value="إيميل">إيميل</option>
                <option value="أخرى">أخرى</option>
              </select>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان البلاغ..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black placeholder:text-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="اشرح شنوة صار..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black placeholder:text-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-100"
              >
                أرسل البلاغ
              </button>
            </div>
          </div>
        )}

        {/* Reports */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">جاري تحميل البلاغات...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">لا توجد بلاغات حالياً</div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                      {report.type}
                    </span>
                    {report.verified && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        ⚠️ مؤكد
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {report.time || report.created_at}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-foreground">{report.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{report.description}</p>
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{report.upvotes}</span>
                </button>

                {/* Comments Section */}
                <div className="mt-6 border-t border-border pt-4">
                  <button
                    onClick={() =>
                      setExpandedReport(expandedReport === report.id ? null : report.id)
                    }
                    className="text-sm font-semibold text-primary hover:underline mb-3"
                  >
                    التعليقات ({(comments[report.id] || []).length})
                  </button>

                  {expandedReport === report.id && (
                    <div className="space-y-4">
  {/* Display Comments */}
  {(comments[report.id] || []).map((comment) => (
    <div
      key={comment.id}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-sm shadow-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
          {comment.user_id.slice(0, 2).toUpperCase()}
        </div>
        <p className="text-emerald-400 text-xs font-medium">
          {comment.user_id.slice(0, 12)}...
        </p>
      </div>
      <p className="text-slate-200 leading-relaxed">{comment.content}</p>
    </div>
  ))}

  {/* Add Comment */}
  <div className="flex gap-3 items-center bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-3 border border-emerald-500/20 backdrop-blur-sm">
    <input
      type="text"
      placeholder="أضف تعليقاً..."
      value={newComments[report.id] || ''}
      onChange={(e) =>
        setNewComments((prev) => ({
          ...prev,
          [report.id]: e.target.value,
        }))
      }
      className="flex-1 rounded-lg border border-emerald-500/30 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
    />
    <button
      onClick={() => handleAddComment(report.id)}
      className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
    >
      إرسال
    </button>
  </div>
</div>
                     
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityAlerts;