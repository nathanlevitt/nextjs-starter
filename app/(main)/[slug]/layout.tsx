export default async function SlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mx-auto grid max-w-5xl flex-col items-center justify-center gap-4 py-10 text-center md:py-12">
      {children}
    </section>
  );
}
