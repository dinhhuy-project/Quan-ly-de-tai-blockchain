import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Heading, Select } from '@/components/common/ui';
import { Success } from '@/components/common/Feedback';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: 'student' as 'student' | 'supervisor',
    organization: 'org1' as 'org1' | 'org2',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as any,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login({
        id: formData.id,
        name: formData.name,
        organization: formData.organization,
        role: formData.role,
      });
      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <Heading level={2} className="text-center mb-8 text-blue-600">
          Quản Lý Đề Tài
        </Heading>

        {showSuccess && <Success message="Đăng nhập thành công! Đang chuyển hướng..." />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ID"
            name="id"
            placeholder="SV001 hoặc GV001"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Tên"
            name="name"
            placeholder="Nhập tên của bạn"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Vai Trò"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isSubmitting}
            options={[
              { value: 'student', label: 'Sinh Viên' },
              { value: 'supervisor', label: 'Giáo Viên Hướng Dẫn' },
            ]}
          />

          <Select
            label="Tổ Chức"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            disabled={isSubmitting}
            options={[
              { value: 'org1', label: 'Tổ Chức 1 (Sinh Viên)' },
              { value: 'org2', label: 'Tổ Chức 2 (Giáo Viên)' },
            ]}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Hệ thống quản lý đề tài dựa trên công nghệ Blockchain Hyperledger Fabric
        </p>
      </div>
    </div>
  );
};
