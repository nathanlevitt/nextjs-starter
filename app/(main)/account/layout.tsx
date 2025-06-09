export default async function AccountSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container grid gap-4 px-4 py-8">{children}</section>
  );
}
