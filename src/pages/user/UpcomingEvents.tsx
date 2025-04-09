
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventCard from '@/components/events/EventCard';
import { useApprovedEvents, useJoinEvent, useUserJoinedEvents } from '@/services/eventService';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const UpcomingEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: events = [], isLoading } = useApprovedEvents();
  const { data: joinedEvents = [] } = useUserJoinedEvents();
  const { mutate: joinEvent } = useJoinEvent();
  
  // Create a map of joined event IDs for quick lookup
  const joinedEventIds = new Set(joinedEvents.map(event => event.id));
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="notion-header mb-1">Upcoming Events</h1>
            <p className="notion-text">Browse and join events</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <p className="text-gray-500">
              {searchTerm 
                ? "No events match your search" 
                : "No upcoming events available"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                onJoin={joinEvent}
                isUserJoined={joinedEventIds.has(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpcomingEvents;
