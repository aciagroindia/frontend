export default function CollectionLoading() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 16px', minHeight: '80vh' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        <span style={{ color: '#9ca3af' }}>/</span>
        <div style={{ width: '100px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>

      {/* Header Skeleton */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ width: '220px', height: '32px', background: '#e5e7eb', borderRadius: '6px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ width: '60%', height: '16px', background: '#f3f4f6', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>

      {/* Main Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              border: '1px solid #f3f4f6', 
              padding: '12px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f3f4f6', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '75%', height: '18px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '40%', height: '16px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
