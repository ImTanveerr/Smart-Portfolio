export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Portfolio. Built with Next.js.</p>
      </div>
    </footer>
  );
}
