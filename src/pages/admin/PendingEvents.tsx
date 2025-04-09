
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventCard from '@/components/events/EventCard';
import { usePendingEvents, useUpdateEventStatus } from '@/services/eventService';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PendingEvents = () => {
  const { data: events = [], isLoading, error, refetch } = usePendingEvents();
  const { mutate: updateEventStatus } = useUpdateEventStatus();
  const { user } = useAuth();

  // Add an effect to refetch on component mount to ensure we have the latest data
  useEffect(() => {
    console.log("PendingEvents component mounted, refetching data");
    refetch();
    
    // Show a toast message to confirm page loaded
    toast.info("Checking for pending events...");
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = (eventId: string) => {
    updateEventStatus({ eventId, status: 'approved' });
  };

  const handleReject = (eventId: string) => {
    updateEventStatus({ eventId, status: 'rejected' });
  };

  // Admin check (for debugging)
  const isAdmin = user?.email === 'prithvimaniar25@gmail.com';
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header mb-1">Pending Events</h1>
          <p className="notion-text">Review and approve event submissions</p>
          
          {isAdmin ? (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-1 px-2 rounded inline-block">
              Logged in as admin: {user?.email}
            </div>
          ) : (
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-1 px-2 rounded inline-block">
              Warning: Not logged in as admin account
            </div>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Error loading pending events: {error.message}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading pending events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="notion-card p-12 text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">No pending events</p>
            <p className="text-gray-500">All event submissions have been reviewed</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                showStatus={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingEvents;
