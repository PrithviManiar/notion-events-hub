
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApprovedEvents, useUserJoinedEvents } from '@/services/eventService';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: approvedEvents = [], isLoading: isLoadingEvents } = useApprovedEvents();
  const { data: joinedEvents = [], isLoading: isLoadingJoinedEvents } = useUserJoinedEvents();

  // Calculate counts
  const upcomingEventsCount = approvedEvents.length;
  const joinedEventsCount = joinedEvents.length;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header">Welcome, {user?.email?.split('@')[0]}</h1>
          <p className="notion-text">Manage your events and discover new ones to join.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Event Card */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Create Event</CardTitle>
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Submit a new event for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/user/create-event')}
              >
                New Event
              </Button>
            </CardContent>
          </Card>
          
          {/* Upcoming Events Card */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                {isLoadingEvents 
                  ? "Loading events..." 
                  : `${upcomingEventsCount} event${upcomingEventsCount !== 1 ? 's' : ''} available`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/user/upcoming-events')}
              >
                Browse Events
              </Button>
            </CardContent>
          </Card>
          
          {/* My Joined Events Card */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">My Events</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                {isLoadingJoinedEvents 
                  ? "Loading joined events..." 
                  : `You've joined ${joinedEventsCount} event${joinedEventsCount !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-6">
              <span className="text-2xl font-bold text-primary">
                {isLoadingJoinedEvents ? "..." : joinedEventsCount}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
