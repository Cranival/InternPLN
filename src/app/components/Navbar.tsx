import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Users, GraduationCap, LogIn, Zap, Menu, X } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Zap className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-blue-900">PLN Intern</span>
              <span className="text-xs text-gray-600">Management System</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Link to="/login">
              <Button size="sm" className="gap-2">
                <LogIn className="size-4" />
                Login Mentor
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/login">
              <Button size="sm" variant="outline" className="gap-2">
                <LogIn className="size-4" />
              </Button>
            </Link>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                      <Zap className="size-4 text-white" />
                    </div>
                    PLN Intern
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.path} to={link.path} onClick={closeMobileMenu}>
                        <Button
                          variant={isActive(link.path) ? 'default' : 'ghost'}
                          className="w-full justify-start gap-3"
                        >
                          <Icon className="size-5" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                  
                  <div className="my-4 border-t" />
                  
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button className="w-full gap-2">
                      <LogIn className="size-5" />
                      Login Mentor
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
