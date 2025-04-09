
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApprovedEvents, usePendingEvents } from '@/services/eventService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users } from 'lucide-react';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: pendingEvents = [], isLoading: isPendingLoading, refetch: refetchPending } = usePendingEvents();
  const { data: approvedEvents = [], isLoading: isApprovedLoading } = useApprovedEvents();

  // Add an effect to refetch pending events on component mount
  useEffect(() => {
    refetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count users (for demo, we'll show a placeholder)
  // In a real app, you would fetch this from Supabase
  const userCount = "N/A";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header">Admin Dashboard</h1>
          <p className="notion-text">Manage events and monitor system activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Events */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Pending Events</CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-yellow-500">
                  {isPendingLoading ? "..." : pendingEvents.length}
                </p>
                <p className="text-sm text-gray-500">Awaiting approval</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/admin/pending-events')}
              >
                Review Requests
              </Button>
            </CardContent>
          </Card>

          {/* Approved Events */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Approved Events</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-green-500">
                  {isApprovedLoading ? "..." : approvedEvents.length}
                </p>
                <p className="text-sm text-gray-500">Active events</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/admin/all-events')}
              >
                View All
              </Button>
            </CardContent>
          </Card>

          {/* User Stats */}
          <Card className="notion-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Registered Users</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-blue-500">{userCount}</p>
                <p className="text-sm text-gray-500">Total users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="notion-card">
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
          </CardHeader>
          <CardContent className="prose">
            <ul className="space-y-2">
              <li>Approve or reject events from the Pending Events page</li>
              <li>View participants for each event on the All Events page</li>
              <li>User analytics will be available in a future update</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
