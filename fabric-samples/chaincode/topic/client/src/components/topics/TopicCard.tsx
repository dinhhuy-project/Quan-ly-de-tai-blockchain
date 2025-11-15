import { Topic } from '@/types';
import { Badge, Button } from '@/components/common/ui';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface TopicCardProps {
  topic: Topic;
  onApprove?: (topicId: string) => void;
  onReject?: (topicId: string) => void;
  onEvaluate?: (topicId: string) => void;
}

export const TopicCard = ({ topic, onApprove, onReject, onEvaluate }: TopicCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const statusBadgeVariant = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    COMPLETED: 'info',
  };

  const statusLabel = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Bị từ chối',
    COMPLETED: 'Hoàn thành',
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{topic.title}</h3>
          <p className="text-gray-600">{topic.topicId}</p>
        </div>
        <Badge variant={statusBadgeVariant[topic.status] as any}>
          {statusLabel[topic.status]}
        </Badge>
      </div>

      <p className="text-gray-700 mb-4">{topic.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-semibold">Sinh viên:</span>
          <p className="text-gray-600">{topic.studentName}</p>
        </div>
        <div>
          <span className="font-semibold">Lĩnh vực:</span>
          <p className="text-gray-600">{topic.field}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" onClick={() => navigate(`/topics/${topic.topicId}`)}>
          Chi tiết
        </Button>

        {user?.role === 'supervisor' && topic.status === 'PENDING' && (
          <>
            {onApprove && (
              <Button variant="success" onClick={() => onApprove(topic.topicId)}>
                Phê duyệt
              </Button>
            )}
            {onReject && (
              <Button variant="danger" onClick={() => onReject(topic.topicId)}>
                Từ chối
              </Button>
            )}
          </>
        )}

        {user?.role === 'supervisor' && topic.status === 'APPROVED' && onEvaluate && (
          <Button variant="secondary" onClick={() => onEvaluate(topic.topicId)}>
            Đánh giá
          </Button>
        )}
      </div>
    </div>
  );
};
