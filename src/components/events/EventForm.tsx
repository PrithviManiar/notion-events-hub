
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Event types for dropdown
const eventTypes = [
  'Workshop',
  'Conference',
  'Meetup',
  'Training',
  'Webinar',
  'Social',
  'Other'
];

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters' }),
  type: z.string().min(1, { message: 'Please select an event type' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  datetime: z.date({ required_error: 'Please select a date and time' })
});

type FormValues = z.infer<typeof formSchema>;

type EventFormProps = {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
};

export default function EventForm({ onSubmit, isLoading }: EventFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      description: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormDescription>
                Give your event a clear and descriptive name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the category that best describes your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event"
                  className="resize-none min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about what participants can expect.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="datetime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Select date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  <div className="p-3 border-t border-gray-100">
                    <Input
                      type="time"
                      onChange={(e) => {
                        const date = field.value || new Date();
                        const [hours, minutes] = e.target.value.split(":");
                        date.setHours(parseInt(hours, 10));
                        date.setMinutes(parseInt(minutes, 10));
                        field.onChange(date);
                      }}
                      value={
                        field.value
                          ? `${String(field.value.getHours()).padStart(2, "0")}:${String(field.value.getMinutes()).padStart(2, "0")}`
                          : ""
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select when your event will take place.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
