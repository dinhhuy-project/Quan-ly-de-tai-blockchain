# Blockchain Explorer - Tài Liệu Thành Phần (Components)

## 📁 Cấu Trúc Thư Mục

```
client/src/
├── components/explorer/
│   ├── NetworkStatsCard.tsx
│   ├── BlocksTable.tsx
│   ├── TransactionsTable.tsx
│   ├── PeersList.tsx
│   ├── BlockDetailModal.tsx
│   ├── TransactionDetailModal.tsx
│   └── PeerDetailModal.tsx
├── pages/
│   └── ExplorerPage.tsx
├── services/
│   └── explorerService.ts
└── types/
    └── index.ts (Explorer types)

server/
├── controllers/
│   └── explorerController.js
├── routes/
│   └── explorerRoutes.js
└── app.js (updated)
```

## 🧩 Component Overview

### 1. **NetworkStatsCard.tsx**

Hiển thị thống kê mạng lưới

**Props:** Không có

**State:**
```typescript
- stats: NetworkStats | null
- loading: boolean
- error: string | null
```

**Features:**
- Auto-refresh mỗi 5 giây
- Hiển thị gradient cards
- Manual refresh button

**Usage:**
```tsx
import NetworkStatsCard from './components/explorer/NetworkStatsCard';

<NetworkStatsCard />
```

---

### 2. **BlocksTable.tsx**

Hiển thị bảng danh sách blocks

**Props:**
```typescript
interface BlocksTableProps {
  onSelectBlock?: (blockNumber: number) => void;
}
```

**State:**
```typescript
- blocks: Block[]
- loading: boolean
- error: string | null
```

**Features:**
- Auto-refresh mỗi 10 giây
- Responsive table
- Hash truncation (16 chars)
- Click handler for block selection

**Usage:**
```tsx
import BlocksTable from './components/explorer/BlocksTable';

<BlocksTable onSelectBlock={(blockNumber) => {
  console.log('Selected block:', blockNumber);
}} />
```

---

### 3. **TransactionsTable.tsx**

Hiển thị bảng danh sách transactions

**Props:**
```typescript
interface TransactionsTableProps {
  onSelectTransaction?: (txId: string) => void;
}
```

**State:**
```typescript
- transactions: Transaction[]
- loading: boolean
- error: string | null
```

**Features:**
- Auto-refresh mỗi 10 giây
- Status badges (green)
- Timestamp formatting
- Transaction ID truncation

**Usage:**
```tsx
import TransactionsTable from './components/explorer/TransactionsTable';

<TransactionsTable onSelectTransaction={(txId) => {
  console.log('Selected transaction:', txId);
}} />
```

---

### 4. **PeersList.tsx**

Hiển thị danh sách peers dạng grid

**Props:**
```typescript
interface PeersListProps {
  onSelectPeer?: (peerId: string) => void;
}
```

**State:**
```typescript
- peers: Peer[]
- loading: boolean
- error: string | null
```

**Features:**
- Auto-refresh mỗi 15 giây
- Grid layout (1, 2, 3 columns responsive)
- Status indicator (green/red)
- Hover effects

**Usage:**
```tsx
import PeersList from './components/explorer/PeersList';

<PeersList onSelectPeer={(peerId) => {
  console.log('Selected peer:', peerId);
}} />
```

---

### 5. **BlockDetailModal.tsx**

Modal hiển thị chi tiết block

**Props:**
```typescript
interface BlockDetailModalProps {
  blockNumber: number | null;
  onClose: () => void;
}
```

**State:**
```typescript
- block: Block | null
- loading: boolean
- error: string | null
```

**Features:**
- Conditional rendering (blockNumber !== null)
- Nested transaction list
- Manual refresh
- Hash display in monospace

**Usage:**
```tsx
const [selectedBlock, setSelectedBlock] = useState(null);

<BlockDetailModal 
  blockNumber={selectedBlock}
  onClose={() => setSelectedBlock(null)}
/>
```

---

### 6. **TransactionDetailModal.tsx**

Modal hiển thị chi tiết transaction

**Props:**
```typescript
interface TransactionDetailModalProps {
  txId: string | null;
  onClose: () => void;
}
```

**State:**
```typescript
- transaction: Transaction | null
- loading: boolean
- error: string | null
```

**Features:**
- Transaction ID display in monospace
- Validation code visualization
- 3-column info grid
- Blockchain confirmation info

**Usage:**
```tsx
const [selectedTx, setSelectedTx] = useState(null);

<TransactionDetailModal 
  txId={selectedTx}
  onClose={() => setSelectedTx(null)}
/>
```

---

### 7. **PeerDetailModal.tsx**

Modal hiển thị chi tiết peer

**Props:**
```typescript
interface PeerDetailModalProps {
  peerId: string | null;
  onClose: () => void;
}
```

**State:**
```typescript
- peer: PeerDetails | null
- loading: boolean
- error: string | null
```

**Features:**
- Peer status display
- Ledger height card
- Current block hash
- Organization info
- Health status badge

**Usage:**
```tsx
const [selectedPeer, setSelectedPeer] = useState(null);

<PeerDetailModal 
  peerId={selectedPeer}
  onClose={() => setSelectedPeer(null)}
/>
```

---

### 8. **ExplorerPage.tsx**

Page chính của Explorer

**Features:**
- Tab navigation
- Header với branding
- Multiple tabs (Overview, Blocks, Transactions, Peers)
- Modal state management
- Overview info cards

**Structure:**
```
ExplorerPage
├── Header
├── Tab Navigation
├── Content Area
│   ├── Overview Tab
│   │   ├── NetworkStatsCard
│   │   └── Info Cards
│   ├── Blocks Tab
│   │   └── BlocksTable
│   ├── Transactions Tab
│   │   └── TransactionsTable
│   └── Peers Tab
│       └── PeersList
└── Modals
    ├── BlockDetailModal
    ├── TransactionDetailModal
    └── PeerDetailModal
```

**Usage:**
```tsx
import ExplorerPage from './pages/ExplorerPage';

<Route path="/explorer" element={<ExplorerPage />} />
```

---

## 🔧 Services

### explorerService.ts

API client cho Explorer

**Methods:**

```typescript
// Blocks
async getBlocks()
async getBlockDetails(blockNumber: number)

// Transactions
async getTransactions()
async getTransactionDetails(txId: string)

// Peers
async getPeers()
async getPeerDetails(peerId: string)

// Network
async getNetworkStats()
```

**Usage:**
```typescript
import explorerService from '@/services/explorerService';

const data = await explorerService.getBlocks();
```

---

## 📡 Backend Controller

### explorerController.js

Express controller cho Explorer endpoints

**Functions:**

```javascript
// Blocks
async getBlocks(req, res)
async getBlockDetails(req, res)

// Transactions
async getTransactions(req, res)
async getTransactionDetails(req, res)

// Peers
async getPeers(req, res)
async getPeerDetails(req, res)

// Network
async getNetworkStats(req, res)
```

**Error Handling:**
- Try-catch blocks
- JSON error responses
- Detailed error messages

---

## 🎨 Styling

### Tailwind CSS Classes

```
Colors:
- bg-blue-50, bg-blue-100, bg-blue-600
- bg-green-50, bg-green-100, bg-green-700
- bg-purple-50, bg-purple-100, bg-purple-700
- bg-orange-50, bg-orange-100, bg-orange-700
- bg-red-50, bg-red-100, bg-red-700

Layout:
- grid, gap, flex
- max-w-7xl, px-4, py-6
- rounded-lg, shadow-md, border

Animation:
- animate-spin (for loading)
- animate-pulse (for skeleton)
- transition-colors, transition-all
```

### Responsive Breakpoints

```
Mobile-first:
- Default: mobile
- md: (768px) tablets
- lg: (1024px) desktops
```

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Service Call (explorerService)
    ↓
API Request (GET /api/explorer/...)
    ↓
Backend Controller
    ↓
Fabric SDK Query
    ↓
Blockchain Data
    ↓
API Response
    ↓
Update Component State
    ↓
Re-render UI
```

---

## ⚡ Performance

### Optimization Techniques

1. **Lazy Loading**
   ```typescript
   const data = await fetchData(); // Load when needed
   ```

2. **Auto-Refresh with Cleanup**
   ```typescript
   useEffect(() => {
     const interval = setInterval(fetch, 5000);
     return () => clearInterval(interval);
   }, []);
   ```

3. **Hash Truncation**
   ```typescript
   const truncate = (hash, length = 16) => 
     hash.length > length ? hash.substring(0, length) + '...' : hash;
   ```

4. **Memoization** (Future enhancement)
   ```typescript
   const MemoizedComponent = memo(Component);
   ```

---

## 🧪 Testing

### Unit Tests

```typescript
// Test NetworkStatsCard
describe('NetworkStatsCard', () => {
  it('should fetch and display stats', () => {
    // Test implementation
  });

  it('should auto-refresh every 5 seconds', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// Test ExplorerPage
describe('ExplorerPage', () => {
  it('should render all tabs', () => {
    // Test implementation
  });

  it('should open modal on item click', () => {
    // Test implementation
  });
});
```

---

## 🐛 Common Issues

### Issue: Modal not closing

```typescript
// ❌ Wrong
const [blockNumber, setBlockNumber] = useState(0);

// ✅ Correct
const [blockNumber, setBlockNumber] = useState(null);

// Then check !== null
if (blockNumber !== null) {
  return <Modal />;
}
```

### Issue: Data not updating

```typescript
// ❌ Wrong - interval not cleaned up
useEffect(() => {
  setInterval(fetch, 5000);
}, []);

// ✅ Correct - cleanup function
useEffect(() => {
  const interval = setInterval(fetch, 5000);
  return () => clearInterval(interval);
}, []);
```

### Issue: Hash truncation not working

```typescript
// ❌ Wrong
const truncate = (hash) => hash.substring(0, 16) + '...';

// ✅ Correct
const truncate = (hash, length = 16) =>
  hash.length > length ? hash.substring(0, length) + '...' : hash;
```

---

## 📚 Best Practices

1. **Always handle errors**
   ```typescript
   catch (err) {
     setError(err instanceof Error ? err.message : 'Unknown error');
   }
   ```

2. **Clean up resources**
   ```typescript
   useEffect(() => {
     const interval = setInterval(...);
     return () => clearInterval(interval);
   }, []);
   ```

3. **Use TypeScript for type safety**
   ```typescript
   interface Props {
     onSelect: (id: string) => void;
   }
   ```

4. **Accessibility**
   ```tsx
   <button aria-label="Refresh" title="Refresh">
     <FiRefreshCw />
   </button>
   ```

5. **Responsive Design**
   ```tsx
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
   ```

---

## 🚀 Future Enhancements

1. **WebSocket Support** - Real-time updates
2. **Charts & Graphs** - Block trends
3. **Export Functionality** - Download data
4. **Advanced Filtering** - Search & filter
5. **Transaction Details** - Payload inspection
6. **Smart Contracts** - Chaincode monitoring

---

**Components Version**: 1.0.0  
**Last Updated**: November 15, 2024  
**Maintainer**: Development Team
