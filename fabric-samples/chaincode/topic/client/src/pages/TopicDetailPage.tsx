import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/apiClient';
import { Header } from '@/components/common/Header';
import { Heading, Badge, Button } from '@/components/common/ui';
import { Loading, Error } from '@/components/common/Feedback';
import { Topic, ApprovalStatus, ChangeHistory } from '@/types';
import { UpdateProgressForm } from '@/components/topics/UpdateProgressForm';
import { ApproveRejectForm } from '@/components/topics/ApproveRejectForm';
import { EvaluationForm } from '@/components/topics/EvaluationForm';
import toast from 'react-hot-toast';

export const TopicDetailPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [changeHistory, setChangeHistory] = useState<ChangeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!user || !topicId) {
      navigate('/login');
      return;
    }
    apiClient.setOrganization(user.organization);
    loadTopicDetails();
  }, [topicId, user, navigate]);

  const loadTopicDetails = async () => {
    try {
      setLoading(true);
      const [topicData, approval, history] = await Promise.all([
        apiClient.getTopicById(topicId!),
        apiClient.getApprovalStatus(topicId!),
        apiClient.getChangeHistory(topicId!),
      ]);

      setTopic(topicData);
      setApprovalStatus(approval);
      setChangeHistory(Array.isArray(history) ? history : []);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Không thể tải thông tin đề tài';
      setError(errorMessage);
      setChangeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (comments: string) => {
    try {
      await apiClient.approveTopic(topicId!, user!.id, user!.name, comments);
      toast.success('Đề tài đã được phê duyệt!');
      await loadTopicDetails();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Lỗi khi phê duyệt');
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await apiClient.rejectTopic(topicId!, user!.id, user!.name, reason);
      toast.success('Đề tài đã bị từ chối!');
      await loadTopicDetails();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Lỗi khi từ chối');
    }
  };

  const handleUpdateProgress = async (stage: string, percentage: number, details: string) => {
    try {
      await apiClient.updateProgress(topicId!, { stage, percentage, details });
      toast.success('Tiến độ đã được cập nhật!');
      await loadTopicDetails();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Lỗi khi cập nhật tiến độ');
    }
  };

  const handleEvaluation = async (evaluation: string, rating: number) => {
    try {
      await apiClient.addEvaluation(topicId!, {
        supervisorId: user!.id,
        supervisorName: user!.name,
        evaluation,
        rating,
      });
      toast.success('Đánh giá đã được gửi!');
      await loadTopicDetails();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Lỗi khi gửi đánh giá');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTopicDetails} />;
  if (!topic) return <Error message="Không tìm thấy đề tài" />;

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
    <div>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <Heading level={1}>{topic.title}</Heading>
            <p className="text-gray-600">{topic.topicId}</p>
          </div>
          <Badge variant={statusBadgeVariant[topic.status] as any}>
            {statusLabel[topic.status]}
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['details', 'progress', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'details' && 'Chi Tiết'}
              {tab === 'progress' && 'Tiến Độ'}
              {tab === 'history' && 'Lịch Sử'}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold mb-4">Thông Tin Chung</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Sinh Viên:</p>
                  <p className="text-gray-600">{topic.studentName}</p>
                </div>
                <div>
                  <p className="font-semibold">ID Sinh Viên:</p>
                  <p className="text-gray-600">{topic.studentId}</p>
                </div>
                <div>
                  <p className="font-semibold">Lĩnh Vực:</p>
                  <p className="text-gray-600">{topic.field}</p>
                </div>
                <div>
                  <p className="font-semibold">Trạng Thái:</p>
                  <p className="text-gray-600">{statusLabel[topic.status]}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold mb-4">Mô Tả</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{topic.description}</p>
            </div>

            {approvalStatus && (
              <div className="card">
                <h3 className="font-bold mb-4">Trạng Thái Phê Duyệt</h3>
                <div className="text-gray-700">
                  <p>Trạng Thái: {approvalStatus.status}</p>
                  {approvalStatus.approvedBy && <p>Phê Duyệt Bởi: {approvalStatus.approvedBy}</p>}
                  {approvalStatus.approvalDate && <p>Ngày Phê Duyệt: {approvalStatus.approvalDate}</p>}
                </div>
              </div>
            )}

            {/* Supervisor Actions */}
            {user?.role === 'supervisor' && topic.status === 'PENDING' && (
              <ApproveRejectForm
                topicTitle={topic.title}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}

            {/* Supervisor Evaluation */}
            {user?.role === 'supervisor' && topic.status === 'APPROVED' && (
              <EvaluationForm topicTitle={topic.title} onSubmit={handleEvaluation} />
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {user?.role === 'student' && (
              <div className="card">
                <h3 className="font-bold mb-4">Cập Nhật Tiến Độ</h3>
                <UpdateProgressForm onSubmit={handleUpdateProgress} />
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card">
            <h3 className="font-bold mb-4">Lịch Sử Thay Đổi</h3>
            {changeHistory.length === 0 ? (
              <p className="text-gray-600">Chưa có thay đổi nào</p>
            ) : (
              <div className="space-y-4">
                {changeHistory.map((entry, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-semibold text-sm text-gray-600">{entry.timestamp}</p>
                    <p className="text-gray-700">{entry.change}</p>
                    <p className="text-sm text-gray-600">Bởi: {entry.modifiedBy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Button variant="secondary" onClick={() => navigate('/')} className="mt-8">
          ← Quay Lại
        </Button>
      </main>
    </div>
  );
};
