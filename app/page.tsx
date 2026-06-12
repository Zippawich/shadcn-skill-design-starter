export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          ระบบพร้อมใช้งาน
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Next.js + shadcn/ui + Tailwind CSS v4
          พร้อม design tokens จาก Figma — ดูสเปกได้ที่ DESIGN.md
        </p>
      </div>
      <div className="w-full rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-lg font-semibold">เริ่มต้นสร้าง UI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          เพิ่ม component แรกด้วย{" "}
          <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm">
            npx shadcn@latest add button
          </code>{" "}
          แล้ว compose ตาม workflow ใน SKILL.md
        </p>
      </div>
    </main>
  );
}
