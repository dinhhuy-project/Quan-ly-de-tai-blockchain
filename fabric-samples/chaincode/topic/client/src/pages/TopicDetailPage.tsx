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
  const [evaluations, setEvaluations] = useState<any[]>([]);
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

      console.log('Change History:', history);
      setTopic(topicData);
      setApprovalStatus(approval);
      setChangeHistory(Array.isArray(history) ? history : []);
      setEvaluations(topicData.evaluations || []);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Không thể tải thông tin đề tài';
      console.error('Load topic error:', err);
      setError(errorMessage);
      setChangeHistory([]);
      setEvaluations([]);
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
          {['details', 'progress', 'evaluations', 'history'].map((tab) => (
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
              {tab === 'evaluations' && 'Đánh Giá'}
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

            {/* Progress Section */}
            {topic.progress && (
              <div className="card">
                <h3 className="font-bold mb-4">Tiến Độ Hiện Tại</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Giai Đoạn: <span className="text-blue-600">{topic.progress.stage}</span></span>
                      <span className="font-semibold">{topic.progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${topic.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                  {topic.progress.lastUpdate && (
                    <p className="text-sm text-gray-600">
                      Cập nhật lần cuối: {new Date(topic.progress.lastUpdate).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            )}

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

            {/* Evaluations Summary in Details Tab */}
            {evaluations && evaluations.length > 0 && (
              <div className="card">
                <h3 className="font-bold mb-4">Đánh Giá ({evaluations.length})</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span className="text-gray-700">Đánh Giá Trung Bình</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(evaluations.reduce((sum, e) => sum + (e.rating || 0), 0) / evaluations.length).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2 font-semibold">Nhận xét gần đây nhất:</p>
                    {evaluations.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-semibold text-gray-700">{evaluations[evaluations.length - 1].supervisorName}</p>
                        <p className="text-gray-600 mt-1 line-clamp-3">{evaluations[evaluations.length - 1].evaluation}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('evaluations')}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    Xem tất cả đánh giá →
                  </button>
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
            {/* Current Progress */}
            {topic.progress && (
              <div className="card">
                <h3 className="font-bold mb-4">Tiến Độ Hiện Tại</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Giai Đoạn: <span className="text-blue-600 text-lg">{topic.progress.stage}</span></span>
                      <span className="font-semibold text-lg">{topic.progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{ width: `${topic.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                  {topic.progress.lastUpdate && (
                    <p className="text-sm text-gray-600">
                      Cập nhật lần cuối: {new Date(topic.progress.lastUpdate).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Update Progress for Student */}
            {user?.role === 'student' && (
              <div className="card">
                <h3 className="font-bold mb-4">Cập Nhật Tiến Độ</h3>
                <UpdateProgressForm onSubmit={handleUpdateProgress} />
              </div>
            )}

            {/* Progress Update History */}
            {topic.progress?.updates && topic.progress.updates.length > 0 && (
              <div className="card">
                <h3 className="font-bold mb-4">Lịch Sử Cập Nhật Tiến Độ</h3>
                <div className="space-y-4">
                  {topic.progress.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded">
                      <p className="font-semibold text-sm text-gray-600">
                        {new Date(update.timestamp).toLocaleString('vi-VN')}
                      </p>
                      <p className="text-gray-700 mt-1">
                        <span className="font-semibold">Giai đoạn:</span> {update.stage} - <span className="font-semibold">Tiến độ:</span> {update.percentage}%
                      </p>
                      <p className="text-gray-700 text-sm mt-1"><span className="font-semibold">Chi tiết:</span> {update.details}</p>
                    </div>
                  ))}
                </div>
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
                    <p className="font-semibold text-sm text-gray-600">{new Date(entry.timestamp).toLocaleString('vi-VN')}</p>
                    <p className="text-gray-700"><span className="font-semibold">{entry.action}:</span> {entry.details}</p>
                    <p className="text-sm text-gray-600">Trạng thái: {entry.status} | Bởi: {entry.actor}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evaluations Tab */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            {/* Evaluation Summary */}
            {evaluations && evaluations.length > 0 && (
              <div className="card">
                <h3 className="font-bold mb-4">Tổng Hợp Đánh Giá</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-gray-600 text-sm">Tổng Số Đánh Giá</p>
                    <p className="text-2xl font-bold text-blue-600">{evaluations.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-gray-600 text-sm">Đánh Giá Trung Bình</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(evaluations.reduce((sum, e) => sum + (e.rating || 0), 0) / evaluations.length).toFixed(1)} / 10
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Evaluations List */}
            {evaluations && evaluations.length > 0 ? (
              <div className="card">
                <h3 className="font-bold mb-4">Chi Tiết Đánh Giá</h3>
                <div className="space-y-4">
                  {evaluations.map((evaluation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{evaluation.supervisorName}</p>
                          <p className="text-sm text-gray-600">ID: {evaluation.supervisorId}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {[...Array(10)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < (evaluation.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{evaluation.rating || 0}/10</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap">{evaluation.evaluation}</p>
                      </div>
                      {evaluation.timestamp && (
                        <p className="text-xs text-gray-500">
                          Đánh giá vào: {new Date(evaluation.timestamp).toLocaleString('vi-VN')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card">
                <p className="text-gray-600 text-center py-8">Chưa có đánh giá nào cho đề tài này</p>
              </div>
            )}

            {/* Supervisor Add Evaluation */}
            {user?.role === 'supervisor' && topic?.status === 'APPROVED' && (
              <div className="card">
                <h3 className="font-bold mb-4">Thêm Đánh Giá</h3>
                <EvaluationForm topicTitle={topic.title} onSubmit={handleEvaluation} />
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
