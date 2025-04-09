
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventCard from '@/components/events/EventCard';
import { usePendingEvents, useUpdateEventStatus } from '@/services/eventService';
import { Card } from '@/components/ui/card';

const PendingEvents = () => {
  const { data: events = [], isLoading } = usePendingEvents();
  const { mutate: updateEventStatus } = useUpdateEventStatus();

  const handleApprove = (eventId: string) => {
    updateEventStatus({ eventId, status: 'approved' });
  };

  const handleReject = (eventId: string) => {
    updateEventStatus({ eventId, status: 'rejected' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header mb-1">Pending Events</h1>
          <p className="notion-text">Review and approve event submissions</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
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
