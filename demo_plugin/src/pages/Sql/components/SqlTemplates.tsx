import { sqlTemplates } from '../data/sqlTemplates';

interface SqlTemplatesProps {
  onSelectTemplate: (sql: string) => void;
}

export const SqlTemplates = ({ onSelectTemplate }: SqlTemplatesProps) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.2rem' }}>
        📋 SQL 模板
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {sqlTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelectTemplate(template.action())}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};