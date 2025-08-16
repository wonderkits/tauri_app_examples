import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '~react-pages';

function App() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        ⏳ 加载中...
      </div>
    }>
      {useRoutes(routes)}
    </Suspense>
  );
}

export default App;