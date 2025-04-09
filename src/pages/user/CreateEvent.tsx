
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventForm from '@/components/events/EventForm';
import { Card } from '@/components/ui/card';
import { useCreateEvent } from '@/services/eventService';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const { mutateAsync: createEvent, isPending } = useCreateEvent();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createEvent(data);
      // Redirect back to dashboard after successful creation
      navigate('/user/dashboard');
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="notion-header mb-6">Create New Event</h1>
        <Card className="notion-card p-6">
          <EventForm onSubmit={handleSubmit} isLoading={isPending} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
