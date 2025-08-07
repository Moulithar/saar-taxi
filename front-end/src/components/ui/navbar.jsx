import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


  useEffect(() => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);




  return (
    <header className="bg-background dark:bg-primary-800 border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/src/assets/primary-saar-taxi-logo.svg"
              alt="Saar Taxi Logo"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/book"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Book a Ride
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/analytics"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Analytics
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="secondary"
         
            >
              Login
            </Button>
            <Button >
              Sign Up
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
            >
              {theme === "light" ? (
                <Sun  />
              ) : (
                <Moon />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:bg-accent hover:text-foreground"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background border-l border-border"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1 space-y-6 py-6">
                    <Link
                      to="/"
                      className="block text-foreground hover:text-primary transition-colors text-lg"
                    >
                      Home
                    </Link>
                    <Link
                      to="/book"
                      className="block text-foreground hover:text-primary transition-colors text-lg"
                    >
                      Book a Ride
                    </Link>
                    <Link
                      to="/about"
                      className="block text-foreground hover:text-primary transition-colors text-lg"
                    >
                      About Us
                    </Link>
                  </div>
                  <div className="space-y-4 pb-6">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
