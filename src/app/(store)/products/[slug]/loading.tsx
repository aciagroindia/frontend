export default function ProductLoading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 16px', minHeight: '80vh' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ width: '60px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        <span style={{ color: '#9ca3af' }}>/</span>
        <div style={{ width: '90px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        <span style={{ color: '#9ca3af' }}>/</span>
        <div style={{ width: '120px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>

      {/* Product Hero Skeleton: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        {/* Left: Product Image Box */}
        <div style={{ width: '100%', aspectRatio: '1/1', background: '#f3f4f6', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />

        {/* Right: Product Info Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '30%', height: '16px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ width: '85%', height: '32px', background: '#e5e7eb', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ width: '40%', height: '24px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          
          <div style={{ width: '100%', height: '1px', background: '#f3f4f6', margin: '8px 0' }} />
          
          <div style={{ width: '100%', height: '60px', background: '#f3f4f6', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <div style={{ flex: 1, height: '48px', background: '#16a34a', opacity: 0.3, borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
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
