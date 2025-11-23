import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { Header } from '@/components/common/Header';
import { Heading, Button } from '@/components/common/ui';
import { Loading, Error } from '@/components/common/Feedback';
import toast from 'react-hot-toast';

// Helper function to convert Long objects and complex types to primitives
const convertToSerializable = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj !== 'object') return obj;
  
  // Check if it's a Long object from Fabric
  if (obj.low !== undefined && obj.high !== undefined) {
    return obj.toNumber ? obj.toNumber() : `${obj.high}${obj.low}`;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertToSerializable);
  }
  
  const converted: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      converted[key] = convertToSerializable(obj[key]);
    }
  }
  return converted;
};

interface BlockchainInfo {
  height: number;
  currentBlockHash: string;
  previousBlockHash: string;
}

interface Block {
  header: {
    number: number;
    previous_hash: string;
    data_hash: string;
  };
  data: {
    data: Array<{
      payload: {
        header: {
          channel_id: string;
          tx_id: string;
          timestamp: string;
        };
      };
    }>;
  };
  metadata?: any;
}

export const BlockchainExplorerPage = () => {
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'blocks' | 'block-detail'>('overview');
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      setError(null);

      const info = await apiClient.getBlockchainInfo();
      setBlockchainInfo(convertToSerializable(info));

      const blocksList = await apiClient.getAllBlocks();
      setBlocks(convertToSerializable(blocksList));

      toast.success('Blockchain data loaded successfully');
    } catch (err: any) {
      const message = err?.message || 'Failed to load blockchain data';
      setError(message);
      toast.error(message);
      console.error('Error loading blockchain data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlock = async (blockNumber: number | any) => {
    try {
      setLoading(true);
      // Ensure blockNumber is a valid number
      const num = typeof blockNumber === 'number' ? blockNumber : parseInt(blockNumber, 10);
      if (isNaN(num)) {
        toast.error('Invalid block number');
        return;
      }
      const block = await apiClient.getBlockByNumber(num);
      setSelectedBlock(convertToSerializable(block));
      setSelectedBlockNumber(num);
      setActiveTab('block-detail');
      toast.success(`Block #${num} loaded`);
    } catch (err: any) {
      const message = err?.message || 'Failed to load block';
      toast.error(message);
      console.error('Error loading block:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Heading level={1}>Blockchain Explorer</Heading>
          <p className="text-gray-600 mt-2">View blockchain information and inspect blocks</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'blocks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Blocks
          </button>
        </div>

        {loading && <Loading message="Loading blockchain data..." />}
        {error && <Error message={error} />}

        {!loading && !error && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && blockchainInfo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Blockchain Height</h3>
                  <p className="text-3xl font-bold text-blue-600">{blockchainInfo.height}</p>
                  <p className="text-gray-500 text-xs mt-2">Total number of blocks</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Current Block Hash</h3>
                  <p className="text-sm font-mono text-gray-800 break-all">{blockchainInfo.currentBlockHash}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Previous Block Hash</h3>
                  <p className="text-sm font-mono text-gray-800 break-all">{blockchainInfo.previousBlockHash}</p>
                </div>
              </div>
            )}

            {/* Blocks Tab */}
            {activeTab === 'blocks' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">All Blocks</h3>
                  <p className="text-gray-600 text-sm mt-1">Total: {blocks.length} blocks</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Block #</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hash</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prev Hash</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Transactions</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {blocks.map((block, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{block.header.number}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-xs">
                            {block.header.data_hash}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-xs">
                            {block.header.previous_hash}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {block.data?.data?.length || 0}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleViewBlock(block.header.number)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {blocks.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No blocks found</p>
                  </div>
                )}
              </div>
            )}

            {/* Block Detail Tab */}
            {activeTab === 'block-detail' && selectedBlock && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Block #{selectedBlockNumber} Details</h3>
                    <p className="text-gray-600 text-sm mt-1">Detailed information about this block</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('blocks')}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Back to Blocks
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Header Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Header Information</h4>
                    <div className="bg-gray-50 rounded p-4 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Block Number</p>
                        <p className="text-sm font-mono text-gray-800">{selectedBlock.header.number}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Data Hash</p>
                        <p className="text-sm font-mono text-gray-800 break-all">{selectedBlock.header.data_hash}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Previous Hash</p>
                        <p className="text-sm font-mono text-gray-800 break-all">{selectedBlock.header.previous_hash}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transactions */}
                  {selectedBlock.data?.data && selectedBlock.data.data.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-3">
                        Transactions ({selectedBlock.data.data.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedBlock.data.data.map((tx: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded p-4 border border-gray-200">
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Transaction ID</p>
                                <p className="text-sm font-mono text-gray-800 break-all">
                                  {tx.payload?.header?.tx_id || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Channel</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.payload?.header?.channel_id || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Timestamp</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.payload?.header?.timestamp
                                    ? new Date(tx.payload.header.timestamp).toLocaleString()
                                    : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!selectedBlock.data?.data || selectedBlock.data.data.length === 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-sm">
                      No transactions in this block
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={loadBlockchainData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};
