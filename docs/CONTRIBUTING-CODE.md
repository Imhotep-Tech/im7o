# دليل المساهمة البرمجية (Contributing Code)

شكراً لاهتمامك بالمساهمة في تطوير مشروع **Im7o**! نرحب بكل المساهمات من المطورين سواء كانت إصلاح أخطاء، تحسينات في الأداء، أو إضافة ميزات ومحركات ألعاب جديدة.

## 🛠️ إعداد بيئة التطوير (Local Setup)

لبدء العمل على المشروع محلياً، اتبع الخطوات التالية:

1. **نسخ المستودع (Clone)**: قم بنسخ المستودع إلى جهازك المحلي.
   ```bash
   git clone https://github.com/Imhotep-Tech/im7o.git
   cd im7o
   ```
2. **تثبيت الحزم (Install Dependencies)**: يتطلب المشروع Node.js.
   ```bash
   npm install
   ```
3. **تشغيل خادم التطوير (Run Dev Server)**:
   ```bash
   npm run dev
   ```
   سيتم تشغيل التطبيق على `http://localhost:3000`.

## 📂 هيكل المشروع (Project Structure)

المشروع مبني باستخدام **Next.js (App Router)** و **Tailwind CSS**. الهيكل الأساسي كالتالي:

- `/src/app`: يحتوي على مسارات الصفحات الرئيسية:
  - `(home)`: واجهة اختيار الألعاب.
  - `/creator`: لوحة تحكم صانع الألعاب (إرسال الألعاب).
  - `/admin`: لوحة تحكم الإدارة لمراجعة وقبول الألعاب.
  - `/game/[id]`: موجه الألعاب الرئيسي (`GameDispatcher`) الذي يعرض المحرك المناسب.
- `/src/engines`: يحتوي على محركات الألعاب (Engines) المختلفة التي تدير منطق كل نوع من الألعاب (مثل `TurnBasedEngine`، `McqEngine`).
- `/src/components`: المكونات القابلة لإعادة الاستخدام (مثل `PortalNav`، `Timer`، `InstructionsModal`).
- `/src/hooks`: الـ Custom Hooks (مثل `useGameEngine` لإدارة حالة اللعبة الموحدة).
- `/src/utils`: دوال مساعدة عامة (مثل `gameUtils.ts`).
- `/src/data`: يحتوي على ملفات JSON للألعاب (`games/`) والبطاقات المرفقة (`cards/`).

## 🚀 إضافة محرك ألعاب جديد (New Engine Template)

إذا كانت لديك فكرة لأسلوب لعب جديد كلياً، يمكنك برمجة محرك (Engine) جديد باتباع الخطوات التالية:

1. **إنشاء مكون المحرك**:
   أنشئ ملفاً جديداً في `src/engines/` (مثال: `MyNewEngine.tsx`). يُفضل أن يعتمد المحرك الجديد على قالب `BaseEngineLayout` إذا كان يتوافق مع التصميم العام، واستخدم `useGameEngine` لإدارة الأدوار والنقاط.
2. **تسجيل المحرك**:
   افتح `src/engines/GameDispatcher.tsx` وقم باستيراد المحرك الجديد، ثم أضفه إلى شرط العرض (Switch Case) بناءً على `config.engineTemplate`.
3. **تحديث واجهة صانع الألعاب (Creator Dashboard)**:
   أضف القالب الجديد إلى قائمة `engineTemplate` في `src/app/creator/page.tsx`. إذا كان المحرك الجديد يتطلب هيكلة بطاقات مختلفة (مثلاً يتطلب صوراً أو 4 خيارات إجابة بدلاً من 2)، أضف الحقول اللازمة لمعالجة هذا التنسيق في الواجهة.
4. **تحديث لوحة الإدارة (Admin Dashboard)**:
   تأكد من أن لوحة الإدارة `src/app/admin/page.tsx` قادرة على استعراض بطاقات المحرك الجديد بوضوح لكي يتمكن المشرفون من مراجعتها قبل القبول.

## 💻 معايير كتابة الكود (Coding Standards)

لضمان جودة الكود وسهولة صيانته، نرجو الالتزام بالمعايير التالية:

- **TypeScript**: استخدم `TypeScript` لكتابة أنواع المتغيرات (Types/Interfaces) بشكل دقيق. تجنب استخدام `any` قدر الإمكان.
- **التصميم والتنسيق (Styling)**: استخدم **Tailwind CSS** فقط. تجنب كتابة CSS مخصص في ملفات خارجية إلا للضرورة القصوى.
- **مكونات الواجهة (UI Components)**: اجعل مكونات الواجهة (مثل الأزرار، البطاقات) قابلة لإعادة الاستخدام وضعها في `src/components/`.
- **فصل المنطق (Separation of Concerns)**: افصل المنطق البرمجي المعقد عن الواجهة الرسومية باستخدام الـ Hooks الموجودة في `src/hooks/` أو دوال المساعدة في `src/utils/`.

## 📝 قواعد رسائل الالتزام (Commit Messages)

نستخدم أسلوب [Conventional Commits](https://www.conventionalcommits.org/) للحفاظ على وضوح التغييرات:
- `feat: إضافة ميزة جديدة` (مثال: `feat: add new imposter engine`)
- `fix: إصلاح خطأ` (مثال: `fix: timer not stopping on elimination`)
- `docs: تحديث الوثائق` (مثال: `docs: update code contribution guidelines`)
- `style: تنسيق الكود أو تعديلات شكلية` (بدون تغيير في المنطق)
- `refactor: إعادة هيكلة الكود` (تحسين الكود بدون إضافة ميزات أو إصلاح أخطاء)

## 🔄 إرسال التعديلات (Pull Request)

1. تأكد من أن الكود يعمل محلياً بدون أخطاء.
2. قم بعمل **Fork** للمستودع إذا لم تكن قد فعلت.
3. أنشئ فرعاً جديداً لتعديلاتك: `git checkout -b feature/my-awesome-feature`
4. التزم بالتعديلات (Commit) مع مراعاة قواعد الرسائل.
5. ارفع التعديلات (Push): `git push origin feature/my-awesome-feature`
6. توجه إلى Github وأنشئ **Pull Request**، واشرح فيه بالتفصيل ما قمت بإضافته أو إصلاحه.
