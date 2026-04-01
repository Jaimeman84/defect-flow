import { CommentItem } from "./comment-item"
import { CommentForm } from "./comment-form"
import type { Comment } from "@prisma/client"

interface CommentListProps {
  comments: Comment[]
  issueId: string
}

export function CommentList({ comments, issueId }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <CommentForm issueId={issueId} />
    </div>
  )
}
