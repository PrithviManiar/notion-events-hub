
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApprovedEvents, usePendingEvents, useUniqueParticipantsCount } from '@/services/eventService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: pendingEvents = [], isLoading: isPendingLoading, refetch: refetchPending, error: pendingError } = usePendingEvents();
  const { data: approvedEvents = [], isLoading: isApprovedLoading } = useApprovedEvents();
  const { data: participantsCount = 0, isLoading: isParticipantsLoading } = useUniqueParticipantsCount();

  // Add an effect to refetch pending events on component mount
  useEffect(() => {
    console.log("AdminDashboard mounted, refetching pending events");
    refetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin check (for debugging)
  const isAdmin = user?.email === 'prithvimaniar25@gmail.com';

  // Log any errors for debugging
  if (pendingError) {
    console.error("Error loading pending events:", pendingError);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="notion-header">Admin Dashboard</h1>
          <p className="notion-text">Manage events and monitor system activity</p>
          
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
                {pendingError && (
                  <p className="text-xs text-red-500 mt-1">Error: {pendingError.message}</p>
                )}
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
                <p className="text-3xl font-bold text-blue-500">
                  {isParticipantsLoading ? "..." : participantsCount}
                </p>
                <p className="text-sm text-gray-500">Total participants</p>
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
              <li>The Registered Users count shows unique users who have joined events</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
