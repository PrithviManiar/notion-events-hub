
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/eventService';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventCardProps = {
  event: Event;
  showStatus?: boolean;
  showParticipants?: boolean;
  participants?: { user_id: string; email: string }[];
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onJoin?: (eventId: string) => void;
  isUserJoined?: boolean;
};

export default function EventCard({
  event,
  showStatus = false,
  showParticipants = false,
  participants = [],
  onApprove,
  onReject,
  onJoin,
  isUserJoined = false
}: EventCardProps) {
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  
  // Format date for display
  const eventDate = new Date(event.datetime);
  const formattedDate = format(eventDate, 'MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  // Get status badge color
  const getStatusColor = () => {
    switch (event.status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="notion-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{event.name}</CardTitle>
            {showStatus && (
              <Badge className={getStatusColor()}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">{event.type}</div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 mb-4">{event.description}</p>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formattedTime}</span>
            </div>
            
            {showParticipants && (
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer" 
                onClick={() => setShowParticipantsDialog(true)}>
                <Users className="h-4 w-4" />
                <span className="text-sm hover:underline">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 pt-2">
          {onApprove && onReject && event.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject(event.id)}
              >
                Reject
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => onApprove(event.id)}
              >
                Approve
              </Button>
            </>
          )}
          
          {onJoin && !isUserJoined && (
            <Button onClick={() => onJoin(event.id)}>
              Join Event
            </Button>
          )}
          
          {isUserJoined && (
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1 px-3">
              Joined
            </Badge>
          )}
        </CardFooter>
      </Card>

      {/* Participants Dialog */}
      <Dialog open={showParticipantsDialog} onOpenChange={setShowParticipantsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Participants</DialogTitle>
            <DialogDescription>
              Users who have joined "{event.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div 
                  key={participant.user_id} 
                  className="p-3 bg-gray-50 rounded-md"
                >
                  {participant.email}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No participants have joined this event yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
