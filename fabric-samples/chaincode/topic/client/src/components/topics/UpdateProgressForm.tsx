import { useState } from 'react';
import { Button, Input, TextArea, Select } from '@/components/common/ui';

interface UpdateProgressFormProps {
  onSubmit: (stage: string, percentage: number, details: string) => Promise<void>;
  isLoading?: boolean;
}

export const UpdateProgressForm = ({ onSubmit, isLoading = false }: UpdateProgressFormProps) => {
  const [formData, setFormData] = useState({
    stage: '',
    percentage: 0,
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.stage) newErrors.stage = 'Giai đoạn là bắt buộc';
    if (formData.percentage < 0 || formData.percentage > 100) newErrors.percentage = 'Phần trăm phải từ 0-100';
    if (!formData.details) newErrors.details = 'Chi tiết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'percentage' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData.stage, formData.percentage, formData.details);
        setFormData({ stage: '', percentage: 0, details: '' });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Giai Đoạn"
        name="stage"
        value={formData.stage}
        onChange={handleChange}
        error={errors.stage}
        disabled={isLoading}
        options={[
          { value: 'INITIAL', label: 'Ban Đầu' },
          { value: 'ANALYSIS', label: 'Phân Tích' },
          { value: 'DEVELOPMENT', label: 'Phát Triển' },
          { value: 'TESTING', label: 'Kiểm Thử' },
          { value: 'COMPLETED', label: 'Hoàn Thành' },
        ]}
      />

      <Input
        label="Tiến độ (%)"
        name="percentage"
        type="number"
        min="0"
        max="100"
        value={formData.percentage.toString()}
        onChange={handleChange}
        error={errors.percentage}
        disabled={isLoading}
      />

      <TextArea
        label="Chi Tiết"
        name="details"
        placeholder="Mô tả chi tiết tiến độ thực hiện..."
        value={formData.details}
        onChange={handleChange}
        error={errors.details}
        disabled={isLoading}
        rows={4}
      />

      <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
        {isLoading ? 'Đang xử lý...' : 'Cập Nhật Tiến Độ'}
      </Button>
    </form>
  );
};
