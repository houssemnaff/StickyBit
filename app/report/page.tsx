'use client'
import { useState } from "react";
import { Users, AlertTriangle, ThumbsUp, Clock, TrendingUp, Plus } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

interface ScamReport {
  id: number;
  type: string;
  title: string;
  description: string;
  upvotes: number;
  time: string;
  verified: boolean;
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
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("SMS");

  const handleUpvote = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleSubmit = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setReports((prev) => [
      {
        id: Date.now(), type: newType, title: newTitle, description: newDesc,
        upvotes: 0, time: "الآن", verified: false,
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewDesc("");
    setShowForm(false);
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
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            بلّغ عن احتيال
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
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground"
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
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="اشرح شنوة صار..."
                rows={3}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
              >
                أرسل البلاغ
              </button>
            </div>
          </div>
        )}

        {/* Reports */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-border bg-card p-6 bg-card-hover">
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
                  {report.time}
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
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityAlerts;