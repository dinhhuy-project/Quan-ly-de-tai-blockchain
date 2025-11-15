import { useState } from 'react';
import { Button, TextArea, Input } from '@/components/common/ui';

interface EvaluationFormProps {
  onSubmit: (evaluation: string, rating: number) => Promise<void>;
  isLoading?: boolean;
  topicTitle: string;
}

export const EvaluationForm = ({ onSubmit, isLoading = false, topicTitle }: EvaluationFormProps) => {
  const [evaluation, setEvaluation] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    try {
      await onSubmit(evaluation, rating);
      setEvaluation('');
      setRating(5);
    } catch (error) {
      console.error('Evaluation submission error:', error);
    }
  };

  return (
    <div className="card space-y-4">
      <h3 className="text-xl font-bold">Đánh giá đề tài: {topicTitle}</h3>

      <TextArea
        label="Nhận xét"
        placeholder="Nhập nhận xét chi tiết về đề tài..."
        value={evaluation}
        onChange={(e) => setEvaluation(e.target.value)}
        disabled={isLoading}
        rows={4}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Điểm đánh giá (1-10)</label>
        <Input
          type="number"
          min="1"
          max="10"
          value={rating.toString()}
          onChange={(e) => setRating(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
          disabled={isLoading}
        />
      </div>

      <Button variant="primary" onClick={handleSubmit} disabled={isLoading} className="w-full">
        {isLoading ? 'Đang xử lý...' : 'Gửi Đánh Giá'}
      </Button>
    </div>
  );
};
