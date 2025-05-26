
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import type { User, PastPerformance, Project as ProjectType, Feedback as FeedbackType } from '@/types';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, MapPin, Phone, Briefcase, Send, UserCircle, Brain } from 'lucide-react';
import { getInitials, getPerformanceBadgeColor, getPerformanceText } from '@/lib/utils';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { generateEmployeeBio, type GenerateEmployeeBioInput } from '@/ai/flows/generate-employee-bio';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function StarRatingDisplay({ rating, large = false }: { rating: number, large?: boolean }) {
  const starSize = large ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
      <span className={`ml-2 font-medium ${large ? 'text-xl' : 'text-sm'} text-muted-foreground`}>({rating.toFixed(1)})</span>
    </div>
  );
}

function EmployeeLoadingSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
        </Card>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </DashboardLayout>
  );
}


export default function EmployeeDetailPage() {
  const params = useParams();
  const { findUserById, updateUser, isLoadingUsers } = useApp();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null | undefined>(null); // undefined for not found, null for loading
  const [aiBio, setAiBio] = useState<string>('');
  const [isGeneratingBio, setIsGeneratingBio] = useState<boolean>(false);
  const [editedBio, setEditedBio] = useState<string>('');

  useEffect(() => {
    if (params.id && !isLoadingUsers) {
      const userId = parseInt(params.id as string);
      const foundUser = findUserById(userId);
      setUser(foundUser);
      setEditedBio(foundUser?.bio || '');
    }
  }, [params.id, findUserById, isLoadingUsers]);

  const handleGenerateBio = async () => {
    if (!user) return;
    setIsGeneratingBio(true);
    setAiBio('');
    try {
      const input: GenerateEmployeeBioInput = {
        fullName: `${user.firstName} ${user.lastName}`,
        position: user.company.title,
        department: user.company.department,
        yearsOfExperience: user.yearsOfExperience || getRandomInt(1,10), // Mock if not present
        skills: user.skills || ['Team Player', 'Communicative'], // Mock if not present
      };
      const result = await generateEmployeeBio(input);
      setAiBio(result.bio);
      setEditedBio(result.bio); // Pre-fill editor
      toast({ title: "AI Bio Generated", description: "Review and save the generated biography." });
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({ title: "Error", description: "Failed to generate AI bio.", variant: "destructive" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSaveBio = () => {
    if (!user) return;
    const updatedUser = { ...user, bio: editedBio };
    updateUser(updatedUser);
    setUser(updatedUser); // Update local state as well
    setAiBio(''); // Clear AI bio suggestion after saving
    toast({ title: "Bio Updated", description: "Employee biography has been saved." });
  };
  
  const getRandomInt = (min: number, max: number): number => { // Helper for mocking
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  if (authLoading || isLoadingUsers || user === null) {
     return <EmployeeLoadingSkeleton />;
  }

  if (!isAuthenticated) return null; // AuthProvider handles redirect

  if (user === undefined) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <UserCircle className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold">Employee Not Found</h1>
          <p className="text-muted-foreground">The employee you are looking for does not exist.</p>
          <Button asChild className="mt-6">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden shadow-lg">
          <div className="relative h-48 bg-gradient-to-r from-primary via-accent to-secondary">
             <Image src={`https://placehold.co/1200x300.png?a=${user.id}`} alt="Profile background" layout="fill" objectFit="cover" data-ai-hint="abstract background" />
          </div>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 relative -mt-16">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl bg-muted">
              <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="employee avatar" />
              <AvatarFallback className="text-4xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 mt-4 md:mt-16">
              <h1 className="text-3xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-lg text-muted-foreground">{user.company.title}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" /> <span>{user.company.department}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> <span>{`${user.address.city}, ${user.address.state}, ${user.address.country}`}</span>
              </div>
               <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> <span>{user.phone}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-16 space-y-2 text-right">
              <StarRatingDisplay rating={user.performanceRating} large />
              <Badge className={`text-sm px-3 py-1 text-white ${getPerformanceBadgeColor(user.performanceRating)}`}>
                {getPerformanceText(user.performanceRating)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-4 sm:grid sm:grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{editedBio || "No biography available."}</p>
                <div className="mt-4">
                  <Button onClick={handleGenerateBio} disabled={isGeneratingBio} variant="outline" size="sm">
                    <Brain className="mr-2 h-4 w-4" />
                    {isGeneratingBio ? "Generating..." : (aiBio || editedBio !== user.bio ? "Regenerate AI Bio" : "Generate AI Bio")}
                  </Button>
                </div>
                {(aiBio || editedBio !== user.bio) && (
                  <div className="mt-4 space-y-2 p-4 border rounded-md bg-muted/50">
                    <Label htmlFor="bio-editor" className="text-sm font-medium">
                      {aiBio ? "AI Generated Bio Suggestion (Editable):" : "Edit Bio:"}
                    </Label>
                    <Textarea 
                      id="bio-editor"
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      rows={5}
                      className="bg-background"
                    />
                    <Button onClick={handleSaveBio} size="sm" className="mt-2">
                      <Send className="mr-2 h-4 w-4" /> Save Bio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Years of Experience</h4>
                        <p className="text-muted-foreground">{user.yearsOfExperience || 'N/A'} years</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {(user.skills && user.skills.length > 0) ? user.skills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            )) : <p className="text-muted-foreground text-sm">No skills listed.</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Past Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                {user.pastPerformance && user.pastPerformance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.pastPerformance.map((perf: PastPerformance) => (
                        <TableRow key={perf.id}>
                          <TableCell>{new Date(perf.date).toLocaleDateString()}</TableCell>
                          <TableCell><StarRatingDisplay rating={perf.rating} /></TableCell>
                          <TableCell className="max-w-xs truncate">{perf.comments}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No past performance data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {user.projects && user.projects.length > 0 ? (
                  <div className="space-y-4">
                    {user.projects.map((project: ProjectType) => (
                      <Card key={project.id} className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge 
                            variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "outline" : "destructive"}
                            className={project.status === "Completed" ? "bg-green-500 text-white" : project.status === "In Progress" ? "border-yellow-500 text-yellow-600" : "bg-red-100 text-red-700"}
                           >
                            {project.status}
                           </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Start Date: {new Date(project.startDate).toLocaleDateString()} 
                            {project.endDate && ` - End Date: ${new Date(project.endDate).toLocaleDateString()}`}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No projects assigned or data unavailable.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Received</CardTitle>
              </CardHeader>
              <CardContent>
                 {user.feedback && user.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {user.feedback.map((fb: FeedbackType) => (
                      <Card key={fb.id} className="bg-muted/30">
                         <CardHeader>
                            <div className="flex justify-between items-start">
                               <div>
                                  <CardTitle className="text-base">{fb.type} Feedback from {fb.from}</CardTitle>
                                  <CardDescription className="text-xs">{new Date(fb.date).toLocaleDateString()}</CardDescription>
                               </div>
                               <Badge variant={
                                fb.type === "Positive" ? "default" : 
                                fb.type === "Constructive" ? "outline" : "secondary"}
                                className={
                                  fb.type === "Positive" ? "bg-green-100 text-green-700 border-green-300" :
                                  fb.type === "Constructive" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                                  "bg-gray-100 text-gray-700 border-gray-300"
                                }
                               >
                                {fb.type}
                               </Badge>
                            </div>
                         </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{fb.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No feedback available for this employee.</p>
                )}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Submit New Feedback</h3>
                   <form onSubmit={(e) => { e.preventDefault(); alert('Feedback submitted (UI Action)'); (e.target as HTMLFormElement).reset(); }} className="space-y-3">
                      <div>
                        <Label htmlFor="feedbackFrom">From (Your Name/Role)</Label>
                        <Input id="feedbackFrom" placeholder="e.g., John Doe / Project Manager" required />
                      </div>
                      <div>
                        <Label htmlFor="feedbackComment">Comment</Label>
                        <Textarea id="feedbackComment" placeholder="Enter your feedback here..." rows={4} required />
                      </div>
                      <Button type="submit" size="sm">
                        <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </Button>
                   </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
