import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen,
  Users,
  Calendar,
  ClipboardCheck,
  Upload,
  TrendingUp,
  GraduationCap,
  FileText,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function TeacherDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teacher's classes
  const { data: myClasses = [] } = useQuery({
    queryKey: ['teacher-classes'],
    queryFn: async () => {
      const res = await fetch('/api/teacher/my-classes');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch students in my classes
  const { data: myStudents = [] } = useQuery({
    queryKey: ['teacher-students'],
    queryFn: async () => {
      const res = await fetch('/api/teacher/my-students');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch materials I uploaded
  const { data: myMaterials = [] } = useQuery({
    queryKey: ['teacher-materials'],
    queryFn: async () => {
      const res = await fetch('/api/teacher/my-materials');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch student progress in my classes
  const { data: studentProgress = [] } = useQuery({
    queryKey: ['teacher-student-progress'],
    queryFn: async () => {
      const res = await fetch('/api/teacher/student-progress');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Calculate metrics
  const totalStudents = myStudents.length;
  const totalEnrollments = myClasses.reduce((sum: number, cls: any) => sum + (cls.enrolled || 0), 0);
  const averageClassSize = myClasses.length > 0
    ? Math.round(totalEnrollments / myClasses.length)
    : 0;
  const completionRate = studentProgress.length > 0
    ? Math.round((studentProgress.filter((p: any) => p.passed).length / studentProgress.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your classes and students
          </p>
        </div>
        <Badge variant="outline" className="text-lg py-2 px-4">
          <GraduationCap className="w-4 h-4 mr-2" />
          Instructor
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Classes you're teaching
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Enrolled across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Class Size</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageClassSize}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Students per class
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Students passing assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="classes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
        </TabsList>

        {/* My Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Classes</h2>
              <p className="text-muted-foreground">Classes you're teaching</p>
            </div>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Create New Class
            </Button>
          </div>

          {myClasses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first class to start teaching
                  </p>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myClasses.map((cls: any) => (
                <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{cls.title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {cls.description}
                        </CardDescription>
                      </div>
                      <Badge className="capitalize">{cls.type?.replace('_', ' ') || 'Class'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Enrolled</p>
                          <p className="font-semibold">{cls.enrolled}/{cls.capacity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold">{formatDate(cls.scheduleDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-semibold">{cls.scheduleTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-semibold">{cls.duration} min</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Students</Button>
                      <Button variant="outline" size="sm">Upload Materials</Button>
                      <Button variant="outline" size="sm">Edit Class</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">My Students</h2>
            <p className="text-muted-foreground">Students enrolled in your classes</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Students ({myStudents.length})</CardTitle>
              <CardDescription>View student progress and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {myStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No students enrolled yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myStudents.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="font-semibold">{student.progress || 0}%</p>
                        </div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Teaching Materials</h2>
              <p className="text-muted-foreground">Materials you've uploaded</p>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </div>

          {myMaterials.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Materials Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload study materials for your students
                  </p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myMaterials.map((material: any) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{material.fileType?.toUpperCase()}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Grading Tab */}
        <TabsContent value="grading" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Student Assessments</h2>
            <p className="text-muted-foreground">Review and grade student work</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{studentProgress.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {studentProgress.filter((p: any) => p.passed).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {studentProgress.length > 0
                    ? Math.round(studentProgress.reduce((sum: number, p: any) => sum + p.score, 0) / studentProgress.length)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Student test attempts and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {studentProgress.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No submissions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentProgress.slice(0, 10).map((progress: any) => (
                    <div key={progress.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          progress.passed ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {progress.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Station Test</p>
                          <p className="text-sm text-muted-foreground">{formatDate(progress.completedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{progress.score}%</p>
                          <Badge variant={progress.passed ? 'default' : 'secondary'} className="mt-1">
                            {progress.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
