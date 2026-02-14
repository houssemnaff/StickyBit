'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🛡️</span>
              <span>CyberAman</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              منصة تثقيفية لحماية نفسك من الاحتيالات الإلكترونية والتصيد الاحتيالي
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline text-muted-foreground hover:text-foreground">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:underline text-muted-foreground hover:text-foreground">
                  الأكاديمية
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:underline text-muted-foreground hover:text-foreground">
                  القاموس
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:underline text-muted-foreground hover:text-foreground">
                  بلّغ عن احتيال
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-3">الأدوات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/detector" className="hover:underline text-muted-foreground hover:text-foreground">
                  كاشف الاحتيالات
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:underline text-muted-foreground hover:text-foreground">
                  محاكي الهجوم
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:underline text-muted-foreground hover:text-foreground">
                  اختبر أمانك
                </Link>
              </li>
              <li>
                <Link href="/recovery" className="hover:underline text-muted-foreground hover:text-foreground">
                  دليل التعافي
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">موارد</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="hover:underline text-muted-foreground hover:text-foreground">
                  ملفي الشخصي
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline text-muted-foreground hover:text-foreground">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-muted-foreground hover:text-foreground">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-muted-foreground hover:text-foreground">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 CyberAman. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">
              تويتر
            </a>
            <a href="#" className="hover:text-foreground">
              فيسبوك
            </a>
            <a href="#" className="hover:text-foreground">
              انستغرام
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
