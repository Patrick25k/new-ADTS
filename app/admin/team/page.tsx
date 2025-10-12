import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  User,
  Share2,
  Eye,
  UserPlus,
} from "lucide-react";

export default function TeamManagement() {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Jean Baptiste Nkurunziza",
      position: "Executive Director",
      department: "Leadership",
      email: "jean@adtsrwanda.org",
      phone: "+250 788 605 493",
      location: "Kigali, Rwanda",
      joinDate: "2018-01-15",
      status: "Active",
      avatar: "JN",
      bio: "Leading ADTS Rwanda with over 15 years of experience in community development and social transformation.",
      skills: ["Leadership", "Strategic Planning", "Community Development"],
      featured: true,
    },
    {
      id: 2,
      name: "Marie Claire Uwimana",
      position: "Program Coordinator",
      department: "Programs",
      email: "marie@adtsrwanda.org",
      phone: "+250 788 308 256",
      location: "Kigali, Rwanda",
      joinDate: "2019-03-20",
      status: "Active",
      avatar: "MU",
      bio: "Coordinating various community programs with focus on women empowerment and youth development.",
      skills: ["Program Management", "Community Outreach", "Training"],
      featured: false,
    },
    {
      id: 3,
      name: "Emmanuel Habimana",
      position: "Finance Manager",
      department: "Finance",
      email: "emmanuel@adtsrwanda.org",
      phone: "+250 788 308 257",
      location: "Kigali, Rwanda",
      joinDate: "2019-06-10",
      status: "Active",
      avatar: "EH",
      bio: "Managing financial operations and ensuring transparent use of resources for maximum community impact.",
      skills: ["Financial Management", "Budgeting", "Compliance"],
      featured: true,
    },
    {
      id: 4,
      name: "Grace Mukamana",
      position: "Communications Specialist",
      department: "Communications",
      email: "grace@adtsrwanda.org",
      phone: "+250 788 308 258",
      location: "Kigali, Rwanda",
      joinDate: "2020-09-15",
      status: "Active",
      avatar: "GM",
      bio: "Managing communications, social media, and community engagement to amplify ADTS impact stories.",
      skills: ["Communications", "Social Media", "Content Creation"],
      featured: false,
    },
    {
      id: 5,
      name: "Samuel Nzeyimana",
      position: "Field Coordinator",
      department: "Field Operations",
      email: "samuel@adtsrwanda.org",
      phone: "+250 788 308 259",
      location: "Musanze, Rwanda",
      joinDate: "2021-02-01",
      status: "On Leave",
      avatar: "SN",
      bio: "Coordinating field activities and direct community interventions in rural areas.",
      skills: [
        "Field Operations",
        "Community Relations",
        "Project Implementation",
      ],
      featured: false,
    },
  ];

  const stats = [
    {
      label: "Total Team",
      value: "12",
      change: "+2",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Members",
      value: "11",
      change: "+1",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Departments",
      value: "5",
      change: "0",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "New This Year",
      value: "3",
      change: "+3",
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Team Management"
        description="Manage team members and organizational structure"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {stat.change} this year
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search team members..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Members
                </Button>
                <Button variant="outline" size="sm">
                  Active
                </Button>
                <Button variant="outline" size="sm">
                  Leadership
                </Button>
                <Button variant="outline" size="sm">
                  Featured
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-white hover:shadow-lg transition-all duration-200 group"
            >
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-primary">
                      {member.avatar}
                    </span>
                  </div>
                </div>
                {member.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={`absolute top-3 right-3 ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-orange-100 text-orange-700 border border-orange-200"
                  }`}
                >
                  {member.status}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {member.position}
                    </p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {member.department}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 text-center line-clamp-2">
                    {member.bio}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Joined {new Date(member.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary/20 hover:bg-primary/5"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
