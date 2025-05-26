
"use client";

import type { User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Bookmark as BookmarkIcon, TrendingUp, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getInitials, getPerformanceBadgeColor, getPerformanceText } from '@/lib/utils';

interface UserCardProps {
  user: User;
}

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

export function UserCard({ user }: UserCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(user.id);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(user.id);
    } else {
      addBookmark(user.id);
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
      <CardHeader className="p-4 bg-secondary/30">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="employee avatar" />
            <AvatarFallback className="text-xl bg-primary/20 text-primary font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{user.company.title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="text-sm">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Age:</span> {user.age}</p>
          <p><span className="font-medium">Department:</span> <Badge variant="secondary" className="text-xs">{user.company.department}</Badge></p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Performance Rating:</p>
          <StarRatingDisplay rating={user.performanceRating} />
           <Badge className={`mt-2 text-xs text-white ${getPerformanceBadgeColor(user.performanceRating)}`}>
              {getPerformanceText(user.performanceRating)}
            </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20 border-t grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" asChild className='p-2'>
          <Link href={`/employee/${user.id}`}>
            <Eye className="h-4 w-4" /> View
          </Link>
        </Button>
        <Button variant={bookmarked ? "secondary" : "outline"} size="sm" onClick={handleBookmarkToggle}  className='p-2'>
          <BookmarkIcon className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : ''}`} /> 
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        <Button variant="default" size="sm" onClick={() => alert(`Promoting ${user.firstName}... (UI Action)`)}>
          <TrendingUp className=" h-4 w-4" /> Promote
        </Button>
      </CardFooter>
    </Card>
  );
}
