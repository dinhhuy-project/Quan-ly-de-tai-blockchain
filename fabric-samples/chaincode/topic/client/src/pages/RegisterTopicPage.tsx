import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTopicStore } from '@/store/topicStore';
import { apiClient } from '@/services/apiClient';
import { Header } from '@/components/common/Header';
import { Heading } from '@/components/common/ui';
import { Loading, Success, Error } from '@/components/common/Feedback';
import { RegisterTopicForm } from '@/components/topics/RegisterTopicForm';
import toast from 'react-hot-toast';

export const RegisterTopicPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addTopic } = useTopicStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    apiClient.setOrganization(user.organization);
  }, [user, navigate]);

  const handleRegister = async (topicData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await apiClient.registerTopic(topicData);
      addTopic(result);
      setSuccess(true);
      toast.success('Đăng ký đề tài thành công!');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Đã xảy ra lỗi khi đăng ký đề tài';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <Loading />;

  return (
    <div>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Heading level={1} className="mb-8">
          Đăng Ký Đề Tài Mới
        </Heading>

        {success && <Success message="Đề tài đã được đăng ký thành công! Đang chuyển hướng..." />}

        {error && <Error message={error} onRetry={() => setError(null)} />}

        {!success && (
          <div className="card">
            <RegisterTopicForm onSubmit={handleRegister} isLoading={isSubmitting} />
          </div>
        )}
      </main>
    </div>
  );
};
