export interface Topic {
  topicId: string;
  title: string;
  description?: string;
  studentId?: string;
  studentName?: string;
  field?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt?: string;
  approvalComments?: string;
  rejectionReason?: string;
  history?: ChangeHistory[];
  progress?: {
    stage: string;
    percentage: number;
    lastUpdate?: string;
    updates?: Array<{
      timestamp: string;
      stage: string;
      percentage: number;
      details: string;
    }>;
  };
  approvedBy?: string;
  comments?: string;
  updatedAt?: string;
  supervisorId?: string;
  supervisorName?: string;
  evaluations?: Evaluation[];
}

export interface Progress {
  topicId: string;
  stage: string;
  percentage: number;
  details: string;
  updatedAt?: string;
}

export interface Evaluation {
  supervisorId: string;
  supervisorName: string;
  evaluation: string;
  rating: number;
  timestamp?: string;
}

export interface ApprovalStatus {
  topicId: string;
  status: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface ChangeHistory {
  timestamp: string;
  action: string;
  status: string;
  actor: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  organization: 'org1' | 'org2';
  role: 'student' | 'supervisor';
}

// Explorer Types
export interface Block {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  txCount: number;
  dataHash: string;
}

export interface Transaction {
  txId: string;
  blockNumber: number;
  type: string;
  timestamp: string;
  status: string;
}

export interface Peer {
  peerId: string;
  name: string;
  url: string;
  status: 'Active' | 'Inactive';
  mspId: string;
}

export interface PeerDetails extends Peer {
  ledgerHeight: number;
  currentBlockHash: string;
}

export interface NetworkStats {
  channelName: string;
  totalBlocks: number;
  totalPeers: number;
  mspId: string;
  latestBlockHash: string;
  timestamp: string;
}

