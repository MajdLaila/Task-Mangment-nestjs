# Task Management System API

## النمط المعماري (Architectural Pattern)

يعتمد هذا المشروع على معمارية الكتلة الواحدة المعيارية
(Modular Monolith)
المستوحاة من مبادئ التصميم الموجه بالمجال
(Domain-Driven Design - DDD).
يتم تقسيم النظام بناءً على ميزات العمل
(Features/Domains)
كسياقات محدودة
(Bounded Contexts)،
وليس بناءً على النوع التقني للملفات
(كما هو الحال في هيكلية MVC التقليدية).
هذا يضمن قابلية التوسع وسهولة فصل الموديولات إلى خدمات مصغرة (Microservices) في المستقبل إذا لزم الأمر.

## هيكلية المجلدات (Directory Structure)
src/
├── main.ts                     # نقطة الدخول وإعدادات التطبيق الأساسية
├── app.module.ts               # الموديول الجذري (Root Module)
│
├── core/                       # الأكواد التي تعمل على مستوى التطبيق (Global)
│   ├── filters/                # معالجة الأخطاء الشاملة (Exception Filters)
│   └── interceptors/           # معالجات الاستجابة (مثل التحويل والتسلسل)
│
└── modules/                    # مجالات التطبيق (Bounded Contexts)
    ├── auth/                   # مجال المصادقة
    │   ├── decorators/         # مزخرفات مخصصة مثل @GetUser
    │   ├── dto/                # كائنات نقل البيانات الخاصة بالمصادقة
    │   ├── entities/           # كيان المستخدم (User Entity)
    │   ├── strategies/         # استراتيجيات Passport (مثل JWT)
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── auth.module.ts
    │
    └── tasks/                  # مجال المهام
        ├── dto/                # التحقق من المدخلات (Data Transfer Objects)
        ├── entities/           # كيان المهمة (Task Entity)
        ├── enums/              # الحالات الثابتة (TaskStatus)
        ├── tasks.controller.ts # التوجيه فقط (Skinny Controller)
        ├── tasks.service.ts    # منطق الأعمال (Fat Service)
        └── tasks.module.ts     # حاوية الاعتماديات (DI Container)

## البنية التحتية (Infrastructure)
* **قاعدة البيانات:** PostgreSQL (عبر Docker).
* **ORM:** Prisma (نمط Data Mapper مع أمان أنواع كامل و Type-Safety).
* **الحاويات:** Docker & Docker Compose لعزل بيئة التطوير عن نظام التشغيل.
