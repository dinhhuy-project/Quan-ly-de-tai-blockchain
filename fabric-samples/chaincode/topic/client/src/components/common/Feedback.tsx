interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = 'Đang tải...' }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Lỗi!</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="ml-4 btn btn-danger">
          Thử lại
        </button>
      )}
    </div>
  );
};

interface SuccessProps {
  message: string;
}

export const Success = ({ message }: SuccessProps) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <strong className="font-bold">Thành công!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};
