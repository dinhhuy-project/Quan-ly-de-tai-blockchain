import { useState } from 'react';
import { Button, TextArea } from '@/components/common/ui';

interface ApproveRejectFormProps {
  onApprove?: (comments: string) => Promise<void>;
  onReject?: (reason: string) => Promise<void>;
  isLoading?: boolean;
  topicTitle: string;
}

export const ApproveRejectForm = ({ onApprove, onReject, isLoading = false, topicTitle }: ApproveRejectFormProps) => {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = async () => {
    if (onApprove) {
      try {
        await onApprove(comments);
        setComments('');
      } catch (error) {
        console.error('Approval error:', error);
      }
    }
  };

  const handleReject = async () => {
    if (onReject) {
      try {
        await onReject(comments);
        setComments('');
      } catch (error) {
        console.error('Rejection error:', error);
      }
    }
  };

  return (
    <div className="card space-y-4">
      <h3 className="text-xl font-bold">Xử lý đề tài: {topicTitle}</h3>

      <TextArea
        label={action === 'approve' ? 'Nhận xét phê duyệt' : action === 'reject' ? 'Lý do từ chối' : 'Nhập bình luận'}
        placeholder={
          action === 'approve'
            ? 'Nhập nhận xét của bạn...'
            : action === 'reject'
              ? 'Nhập lý do từ chối...'
              : 'Chọn hành động trước'
        }
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        disabled={isLoading || !action}
        rows={4}
      />

      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          onClick={() => {
            setAction(null);
            setComments('');
          }}
          disabled={isLoading}
        >
          Hủy
        </Button>

        {onApprove && (
          <Button
            variant={action === 'approve' ? 'success' : 'secondary'}
            onClick={() => (action === 'approve' ? handleApprove() : setAction('approve'))}
            disabled={isLoading}
          >
            {action === 'approve' ? (isLoading ? 'Đang xử lý...' : 'Xác nhận phê duyệt') : 'Phê Duyệt'}
          </Button>
        )}

        {onReject && (
          <Button
            variant={action === 'reject' ? 'danger' : 'secondary'}
            onClick={() => (action === 'reject' ? handleReject() : setAction('reject'))}
            disabled={isLoading}
          >
            {action === 'reject' ? (isLoading ? 'Đang xử lý...' : 'Xác nhận từ chối') : 'Từ Chối'}
          </Button>
        )}
      </div>
    </div>
  );
};
