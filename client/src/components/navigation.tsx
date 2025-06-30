import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold text-slate-900 cursor-pointer">Blog CMS</h1>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location === '/' 
                    ? 'border-primary text-slate-900' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/admin">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.startsWith('/admin') 
                    ? 'border-primary text-slate-900' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}>
                  Admin Dashboard
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/admin/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
