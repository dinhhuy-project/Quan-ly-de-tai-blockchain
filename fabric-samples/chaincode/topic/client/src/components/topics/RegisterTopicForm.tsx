import { useState } from 'react';
import { Button, Input, TextArea, Select } from '@/components/common/ui';

interface RegisterTopicFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterTopicForm = ({ onSubmit, isLoading = false }: RegisterTopicFormProps) => {
  const [formData, setFormData] = useState({
    topicId: '',
    title: '',
    description: '',
    studentId: '',
    studentName: '',
    field: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.topicId) newErrors.topicId = 'ID đề tài là bắt buộc';
    if (!formData.title) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.description) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.studentId) newErrors.studentId = 'ID sinh viên là bắt buộc';
    if (!formData.studentName) newErrors.studentName = 'Tên sinh viên là bắt buộc';
    if (!formData.field) newErrors.field = 'Lĩnh vực là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        setFormData({
          topicId: '',
          title: '',
          description: '',
          studentId: '',
          studentName: '',
          field: '',
        });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="ID Đề Tài"
        name="topicId"
        placeholder="TOPIC001"
        value={formData.topicId}
        onChange={handleChange}
        error={errors.topicId}
        disabled={isLoading}
      />

      <Input
        label="Tiêu Đề"
        name="title"
        placeholder="Nhập tiêu đề đề tài"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        disabled={isLoading}
      />

      <TextArea
        label="Mô Tả"
        name="description"
        placeholder="Mô tả chi tiết về đề tài"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        disabled={isLoading}
        rows={4}
      />

      <Input
        label="ID Sinh Viên"
        name="studentId"
        placeholder="SV001"
        value={formData.studentId}
        onChange={handleChange}
        error={errors.studentId}
        disabled={isLoading}
      />

      <Input
        label="Tên Sinh Viên"
        name="studentName"
        placeholder="Nguyễn Văn A"
        value={formData.studentName}
        onChange={handleChange}
        error={errors.studentName}
        disabled={isLoading}
      />

      <Select
        label="Lĩnh Vực"
        name="field"
        value={formData.field}
        onChange={handleChange}
        error={errors.field}
        disabled={isLoading}
        options={[
          { value: 'AI', label: 'Trí Tuệ Nhân Tạo' },
          { value: 'Blockchain', label: 'Blockchain' },
          { value: 'Web', label: 'Web Development' },
          { value: 'Mobile', label: 'Mobile Development' },
          { value: 'IoT', label: 'Internet of Things' },
        ]}
      />

      <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
        {isLoading ? 'Đang xử lý...' : 'Đăng Ký Đề Tài'}
      </Button>
    </form>
  );
};
