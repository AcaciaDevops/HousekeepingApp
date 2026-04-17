import { useState, useCallback } from 'react';
import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';

const API_URL = process.env.EXPO_PUBLIC_APP_API_PORTFOLIO_SERVICE_URL || 'YOUR_API_URL';

const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to make authenticated requests
  const makeRequest = async (url, options = {}) => {
    const authHeader = await getAuthorizationHeader();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  };

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await makeRequest(API_URL);
      setPortfolios(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPortfolioById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await makeRequest(`${API_URL}/${id}`);
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPortfolio = async (data) => {
    try {
      const responseData = await makeRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchPortfolios();
      return responseData;
    } catch (err) {
      const errorInfo = err.message || 'Failed to create portfolio';
      setError(errorInfo);
      throw err;
    }
  };

  const updatePortfolio = async (id, data) => {
    try {
      const responseData = await makeRequest(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchPortfolios();
      return responseData;
    } catch (err) {
      const errorInfo = err.message || 'Failed to update portfolio';
      setError(errorInfo);
      throw err;
    }
  };

  const deletePortfolio = async (id) => {
    try {
      const responseData = await makeRequest(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchPortfolios();
      return responseData;
    } catch (err) {
      const errorInfo = err.message || 'Failed to delete portfolio';
      setError(errorInfo);
      throw err;
    }
  };

  return {
    portfolios,
    portfolio,
    loading,
    error,
    fetchPortfolios,
    fetchPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
};

export default usePortfolio;