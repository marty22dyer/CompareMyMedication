import Link from "next/link";
import Logo from "./Logo";

export default function Navigation() {
  return (
    <nav className="cmm-nav">
      <div className="cmm-nav__inner">
        <Link href="/" className="cmm-brand">
          <Logo />
        </Link>
        
        <div className="cmm-links">
          <Link href="/compare" className="cmm-link">Compare</Link>
          <Link href="/about" className="cmm-link">About</Link>
        </div>
      </div>
    </nav>
  );
}
