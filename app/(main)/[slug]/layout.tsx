export default async function SlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid flex-col items-center justify-center max-w-5xl gap-4 py-10 mx-auto text-center md:py-12">
      {children}
    </section>
  );
}
