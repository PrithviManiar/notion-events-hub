
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  ClipboardList, 
  CheckCircle, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === 'meowmeow@meow.com';

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 w-64 p-4",
      className
    )}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Event Manager</h1>
      </div>

      <nav className="space-y-2 flex-1">
        {/* Admin Navigation */}
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/pending-events" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <ClipboardList className="h-5 w-5" />
              <span>Pending Events</span>
            </NavLink>
            <NavLink to="/admin/all-events" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <CheckCircle className="h-5 w-5" />
              <span>All Approved Events</span>
            </NavLink>
          </>
        ) : (
          // User Navigation
          <>
            <NavLink to="/user/dashboard" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/user/create-event" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <PlusCircle className="h-5 w-5" />
              <span>Create Event</span>
            </NavLink>
            <NavLink to="/user/upcoming-events" className={({ isActive }) => 
              cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                isActive ? "bg-gray-100 text-primary" : "text-gray-700")
            }>
              <CalendarIcon className="h-5 w-5" />
              <span>Upcoming Events</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'User'}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
