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

// Helper function to format timestamp
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  try {
    // If timestamp is an object with seconds
    if (typeof timestamp === 'object' && timestamp.seconds) {
      const seconds = parseInt(timestamp.seconds, 10);
      if (!isNaN(seconds)) {
        return new Date(seconds * 1000).toLocaleString();
      }
    }
    
    // If timestamp is already a number (milliseconds)
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleString();
    }
    
    // If timestamp is a string
    if (typeof timestamp === 'string') {
      const ms = parseInt(timestamp, 10);
      if (!isNaN(ms)) {
        return new Date(ms).toLocaleString();
      }
    }
    
    return 'N/A';
  } catch (error) {
    return 'N/A';
  }
};

// Helper function to get block number
const getBlockNumber = (tx: any): number | string => {
  if (tx.blockNumber !== undefined && tx.blockNumber !== null) {
    return tx.blockNumber;
  }
  if (tx.block_number !== undefined && tx.block_number !== null) {
    return tx.block_number;
  }
  return 'N/A';
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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'blocks' | 'block-detail' | 'transactions' | 'transaction-detail'>('overview');
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

      const txList = await apiClient.getAllTransactions();
      setTransactions(convertToSerializable(txList));

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
      
      // Load block details
      const block = await apiClient.getBlockByNumber(num);
      setSelectedBlock(convertToSerializable(block));
      
      // Load transactions for this block
      const blockTransactions = await apiClient.getTransactionByNumber(num);
      setSelectedTransaction(convertToSerializable(blockTransactions));
      
      setSelectedBlockNumber(num);
      setActiveTab('block-detail');
      toast.success(`Block #${num} and transactions loaded`);
    } catch (err: any) {
      const message = err?.message || 'Failed to load block';
      toast.error(message);
      console.error('Error loading block:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTransactionByNumber = async (blockNumber: number | any) => {
    try {
      setLoading(true);
      const num = typeof blockNumber === 'number' ? blockNumber : parseInt(blockNumber, 10);
      if (isNaN(num)) {
        toast.error('Invalid block number');
        return;
      }
      const transaction = await apiClient.getTransactionByNumber(num);
      setSelectedTransaction(convertToSerializable(transaction));
      setSelectedBlockNumber(num);
      setActiveTab('transaction-detail');
      toast.success(`Transactions for block #${num} loaded`);
    } catch (err: any) {
      const message = err?.message || 'Failed to load transactions';
      toast.error(message);
      console.error('Error loading transactions:', err);
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
        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'blocks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Transactions
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

                  {/* Transactions from API */}
                  {selectedTransaction && Array.isArray(selectedTransaction) && selectedTransaction.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-3">
                        Transactions for Block #{selectedBlockNumber} ({selectedTransaction.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedTransaction.map((tx: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded p-4 border border-gray-200">
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Transaction ID</p>
                                <p className="text-sm font-mono text-gray-800 break-all">
                                  {tx.txId || tx.tx_id || `TX-${index}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Channel</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.channelId || tx.channel || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Timestamp</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {formatTimestamp(tx.timestamp)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Creator MSP</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.creatorMSP || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Type</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.type || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Legacy Transactions from Block Data */}
                  {(!selectedTransaction || !Array.isArray(selectedTransaction) || selectedTransaction.length === 0) && 
                   selectedBlock.data?.data && selectedBlock.data.data.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-3">
                        Block Data Transactions ({selectedBlock.data.data.length})
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

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">All Transactions</h3>
                  <p className="text-gray-600 text-sm mt-1">Total: {transactions.length} transactions</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">TX ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Channel</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Block #</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((tx: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-xs">
                            {tx.txId || tx.tx_id || tx.transactionId || `TX-${index}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {tx.channelId || tx.channel || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatTimestamp(tx.timestamp)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            #{getBlockNumber(tx)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {tx.blockNumber !== undefined && tx.blockNumber !== null && (
                              <button
                                onClick={() => handleViewTransactionByNumber(tx.blockNumber)}
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {transactions.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            )}

            {/* Transaction Detail Tab */}
            {activeTab === 'transaction-detail' && selectedTransaction && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Transactions for Block #{selectedBlockNumber}</h3>
                    <p className="text-gray-600 text-sm mt-1">Detailed transactions information</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Back to Transactions
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {selectedTransaction && Array.isArray(selectedTransaction) && selectedTransaction.length > 0 ? (
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-3">
                        Transactions ({selectedTransaction.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedTransaction.map((tx: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded p-4 border border-gray-200">
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Transaction ID</p>
                                <p className="text-sm font-mono text-gray-800 break-all">
                                  {tx.txId || tx.tx_id || tx.transactionId || `TX-${index}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Channel</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.channelId || tx.channel || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Timestamp</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {formatTimestamp(tx.timestamp)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Block Number</p>
                                <p className="text-sm font-mono text-gray-800">
                                  #{getBlockNumber(tx)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Creator MSP</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.creatorMSP || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Type</p>
                                <p className="text-sm font-mono text-gray-800">
                                  {tx.type || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 uppercase">Full Data</p>
                                <pre className="text-xs font-mono text-gray-800 bg-white border rounded p-2 overflow-auto max-h-40">
                                  {JSON.stringify(tx, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-sm">
                      No transaction details available
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
