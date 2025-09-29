'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Truck, 
  Calendar, 
  Bell, 
  TrendingUp,
  Users,
  FileText,
  Clock
} from 'lucide-react'

interface DashboardData {
  rateRequestStats: {
    pending: number
    processing: number
    completed: number
    rejected: number
  }
  bookingStats: {
    pending: number
    confirmed: number
    cancelled: number
  }
  itineraryStats: {
    draft: number
    submitted: number
    approved: number
    rejected: number
  }
  recentActivities: Array<{
    id: string
    type: string
    date: string
    notes: string
    user: {
      name: string
    }
    customer?: {
      companyName: string
    }
  }>
  notifications: Array<{
    id: string
    subject: string
    body: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">Unable to load dashboard data</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to Freight Pricing System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('refreshToken')
                  localStorage.removeItem('user')
                  router.push('/login')
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rate Requests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData.rateRequestStats.pending + dashboardData.rateRequestStats.processing + dashboardData.rateRequestStats.completed + dashboardData.rateRequestStats.rejected}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Badge variant="warning">{dashboardData.rateRequestStats.pending} Pending</Badge>
                <Badge variant="info">{dashboardData.rateRequestStats.processing} Processing</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-success-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Bookings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData.bookingStats.pending + dashboardData.bookingStats.confirmed + dashboardData.bookingStats.cancelled}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Badge variant="warning">{dashboardData.bookingStats.pending} Pending</Badge>
                <Badge variant="success">{dashboardData.bookingStats.confirmed} Confirmed</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-warning-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Itineraries
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData.itineraryStats.draft + dashboardData.itineraryStats.submitted + dashboardData.itineraryStats.approved + dashboardData.itineraryStats.rejected}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Badge variant="info">{dashboardData.itineraryStats.submitted} Submitted</Badge>
                <Badge variant="success">{dashboardData.itineraryStats.approved} Approved</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-8 w-8 text-danger-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Notifications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData.notifications.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activities and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user.name}</span> - {activity.type}
                      </p>
                      <p className="text-sm text-gray-500">{activity.notes}</p>
                      {activity.customer && (
                        <p className="text-xs text-gray-400">{activity.customer.companyName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-warning-100 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-warning-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.subject}</p>
                      <p className="text-sm text-gray-500">{notification.body}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}