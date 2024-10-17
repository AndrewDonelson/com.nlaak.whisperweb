// file: @/components/ledger/PostTXCard.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

// Assuming the structure of PostTX. Adjust as necessary based on your actual implementation.
interface PostTX {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
}

interface PostTXCardProps {
  postTx: PostTX;
}

const PostTXCard: React.FC<PostTXCardProps> = ({ postTx }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${postTx.sender}`} />
            <AvatarFallback>{postTx.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{postTx.sender}</CardTitle>
            <CardDescription>
              {formatDistanceToNow(postTx.timestamp, { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{postTx.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-4 h-4 mr-2" />
          {postTx.likes}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          {postTx.comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          {postTx.shares}
        </Button>
      </CardFooter>
      <CardFooter>
        <Badge variant="secondary" className="w-full justify-center">
          Transaction ID: {postTx.id.substring(0, 8)}...
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PostTXCard;