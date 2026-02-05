export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} depp
      </div>
    </footer>
  );
}
