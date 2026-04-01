import { formatDateTime } from "@/lib/formatters"
import { getInitials } from "@/lib/utils"
import type { Comment } from "@prisma/client"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  const author = comment.authorName ?? "QA Tester"
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
        {getInitials(author)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm whitespace-pre-wrap">{comment.body}</p>
      </div>
    </div>
  )
}
