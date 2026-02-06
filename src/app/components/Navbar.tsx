import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Users, GraduationCap, Zap, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Zap },
    { path: '/mentor', label: 'Mentor', icon: Users },
    { path: '/intern', label: 'Intern', icon: GraduationCap },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-950/30 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 transition-all duration-200 group-hover:bg-white/25 group-hover:scale-105 shadow-md">
              <Zap className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight">PLN Intern</span>
              <span className="text-xs text-blue-200">Management System</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    className={`gap-2.5 px-5 py-2.5 text-lg transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-white/20 text-white hover:bg-white/25 hover:text-white font-medium'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="size-5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-11 text-white hover:bg-white/10">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-blue-200">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-left">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 shadow-md">
                      <Zap className="size-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-blue-900">PLN Intern</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 flex flex-col gap-3">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.path} to={link.path} onClick={closeMobileMenu}>
                        <Button
                          variant={isActive(link.path) ? 'default' : 'ghost'}
                          className="w-full justify-start gap-3 text-base py-6"
                        >
                          <Icon className="size-5" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
