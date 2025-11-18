import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTopicStore } from '@/store/topicStore';
import { apiClient } from '@/services/apiClient';
import { Header } from '@/components/common/Header';
import { Heading, Button } from '@/components/common/ui';
import { Loading, Error } from '@/components/common/Feedback';
import { TopicCard } from '@/components/topics/TopicCard';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { topics, loading, error, fetchTopics, fetchTopicsByStudent } = useTopicStore();
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    apiClient.setOrganization(user.organization);

    if (user.role === 'student') {
      fetchTopicsByStudent(user.id);
    } else {
      // Giáo viên xem tất cả các topics
      fetchTopics();
    }
  }, [user, navigate]);

  const filteredTopics = filterStatus === 'ALL' ? topics : topics.filter((t) => t.status === filterStatus);

  if (loading) return <Loading />;

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Heading level={1} className="mb-4">
            {user?.role === 'student' ? 'Các Đề Tài Của Tôi' : 'Đề Tài Cần Duyệt'}
          </Heading>

          <div className="flex gap-4 mb-6 flex-wrap">
            {user?.role === 'student' && (
              <Button variant="primary" onClick={() => navigate('/topics/register')}>
                + Đăng Ký Đề Tài Mới
              </Button>
            )}

            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="PENDING">Chờ Duyệt</option>
              <option value="APPROVED">Đã Duyệt</option>
              <option value="REJECTED">Bị Từ Chối</option>
              <option value="COMPLETED">Hoàn Thành</option>
            </select>
          </div>
        </div>

        {error && <Error message={error} onRetry={() => fetchTopics()} />}

        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Không có đề tài nào</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.topicId} topic={topic} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
