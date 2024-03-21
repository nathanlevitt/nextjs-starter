export default async function AccountSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container grid gap-4 py-10 md:py-12">
      {children}
    </section>
  );
}
