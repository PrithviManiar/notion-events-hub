
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventCard from '@/components/events/EventCard';
import { useEventsWithParticipants } from '@/services/eventService';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AllEvents = () => {
  const { data: events = [], isLoading } = useEventsWithParticipants();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header mb-1">All Approved Events</h1>
          <p className="notion-text">View all active events and their participants</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="notion-card p-12 text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">No approved events</p>
            <p className="text-gray-500">There are no approved events at this time</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                showParticipants={true}
                participants={event.participants || []}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllEvents;
