import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import './app/global.css';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
document.head.appendChild(link);

import LandingPage from './app/page';
import DashboardLayout from './app/dashboard/layout';
import DashboardPage from './app/dashboard/page';
import WeatherMarketingPage from './app/dashboard/weather-marketing/page';
import SnsContentPage from './app/dashboard/sns-content/page';
import ReviewReplyPage from './app/dashboard/review-reply/page';
import MarketAnalysisPage from './app/dashboard/market-analysis/page';
import SupportFundPage from './app/dashboard/support-fund/page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="weather-marketing" element={<WeatherMarketingPage />} />
              <Route path="sns-content" element={<SnsContentPage />} />
              <Route path="review-reply" element={<ReviewReplyPage />} />
              <Route path="market-analysis" element={<MarketAnalysisPage />} />
              <Route path="support-fund" element={<SupportFundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
