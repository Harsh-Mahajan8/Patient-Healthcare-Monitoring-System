export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
      © {year} Patient Healthcare Monitoring System. All rights reserved.
    </footer>
  );
}
