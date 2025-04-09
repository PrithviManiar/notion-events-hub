
import { useSupabase } from '@/contexts/SupabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Event {
  id: string;
  name: string;
  type: string;
  description: string;
  datetime: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
}

export interface EventWithParticipants extends Event {
  participants?: { user_id: string; email: string }[];
}

// Hook to get all approved events
export const useApprovedEvents = () => {
  const { supabase } = useSupabase();
  
  return useQuery({
    queryKey: ['approvedEvents'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('datetime', { ascending: true });
        
      if (error) throw error;
      return data as Event[];
    }
  });
};

// Hook to get pending events (admin only)
export const usePendingEvents = () => {
  const { supabase } = useSupabase();
  
  return useQuery({
    queryKey: ['pendingEvents'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('datetime', { ascending: true });
        
      if (error) throw error;
      return data as Event[];
    }
  });
};

// Hook to get all events with participant information
export const useEventsWithParticipants = () => {
  const { supabase } = useSupabase();
  
  return useQuery({
    queryKey: ['eventsWithParticipants'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // First get all approved events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved');
        
      if (eventsError) throw eventsError;
      
      // For each event, get participants
      const eventsWithParticipants: EventWithParticipants[] = [];
      
      for (const event of events) {
        // Get participant user IDs for this event
        const { data: participants, error: participantsError } = await supabase
          .from('event_participants')
          .select('user_id')
          .eq('event_id', event.id);
          
        if (participantsError) throw participantsError;
        
        // Get user details for each participant
        const participantDetails = [];
        for (const participant of participants) {
          const { data: userData, error: userError } = await supabase
            .from('users')  // This assumes a users table is accessible
            .select('email')
            .eq('id', participant.user_id)
            .single();
            
          if (!userError && userData) {
            participantDetails.push({
              user_id: participant.user_id,
              email: userData.email
            });
          }
        }
        
        eventsWithParticipants.push({
          ...event,
          participants: participantDetails
        });
      }
      
      return eventsWithParticipants;
    }
  });
};

// Hook to create a new event
export const useCreateEvent = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'created_by' | 'status'>) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      if (!user) throw new Error('User not authenticated');
      
      const newEvent = {
        ...eventData,
        created_by: user.id,
        status: 'pending' as const
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Event submitted for approval');
      queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
    },
    onError: (error) => {
      toast.error('Failed to create event', {
        description: error.message
      });
    }
  });
};

// Hook to approve or reject an event
export const useUpdateEventStatus = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string, status: 'approved' | 'rejected' }) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Event ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
      queryClient.invalidateQueries({ queryKey: ['approvedEvents'] });
      queryClient.invalidateQueries({ queryKey: ['eventsWithParticipants'] });
    },
    onError: (error) => {
      toast.error('Failed to update event status', {
        description: error.message
      });
    }
  });
};

// Hook to join an event
export const useJoinEvent = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      if (!user) throw new Error('User not authenticated');
      
      // Check if user already joined this event
      const { data: existingJoin, error: checkError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id);
        
      if (checkError) throw checkError;
      
      // If already joined, return early
      if (existingJoin && existingJoin.length > 0) {
        throw new Error('You have already joined this event');
      }
      
      // Join the event
      const { data, error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('You have joined the event');
      queryClient.invalidateQueries({ queryKey: ['eventsWithParticipants'] });
      queryClient.invalidateQueries({ queryKey: ['userJoinedEvents'] });
    },
    onError: (error) => {
      toast.error('Failed to join event', {
        description: error.message
      });
    }
  });
};

// Hook to get events a user has joined
export const useUserJoinedEvents = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userJoinedEvents'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not initialized');
      if (!user) throw new Error('User not authenticated');
      
      // Get IDs of events the user has joined
      const { data: participations, error: participationsError } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', user.id);
        
      if (participationsError) throw participationsError;
      
      if (!participations || participations.length === 0) {
        return [];
      }
      
      // Get the event details for these IDs
      const eventIds = participations.map(p => p.event_id);
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .eq('status', 'approved');
        
      if (eventsError) throw eventsError;
      
      return events as Event[];
    }
  });
};
