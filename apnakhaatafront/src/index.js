import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
                <Toaster position="top-right" />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
