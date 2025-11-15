import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const explorerService = {
  // Blocks
  async getBlocks() {
    const response = await axios.get(`${API_BASE_URL}/explorer/blocks`);
    return response.data;
  },

  async getBlockDetails(blockNumber) {
    const response = await axios.get(`${API_BASE_URL}/explorer/blocks/${blockNumber}`);
    return response.data;
  },

  // Transactions
  async getTransactions() {
    const response = await axios.get(`${API_BASE_URL}/explorer/transactions`);
    return response.data;
  },

  async getTransactionDetails(txId) {
    const response = await axios.get(`${API_BASE_URL}/explorer/transactions/${txId}`);
    return response.data;
  },

  // Peers
  async getPeers() {
    const response = await axios.get(`${API_BASE_URL}/explorer/peers`);
    return response.data;
  },

  async getPeerDetails(peerId) {
    const response = await axios.get(`${API_BASE_URL}/explorer/peers/${peerId}`);
    return response.data;
  },

  // Network Stats
  async getNetworkStats() {
    const response = await axios.get(`${API_BASE_URL}/explorer/stats`);
    return response.data;
  }
};

export default explorerService;
