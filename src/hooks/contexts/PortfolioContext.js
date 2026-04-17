import React, { createContext, useContext, useEffect, useState } from 'react';
import usePortfolioData from '../../api/usePortfolioData';
import usePropertyData from '../../api/usePropertyData';
import useAuth from '../../features/auth/hooks/useAuth';

const PortfolioContext = createContext();

export const usePortfolioContext = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const { user, isInitialized: authInitialized } = useAuth();
  console.log("user::1212", user);
  const { portfolio, loading: portfolioLoading, error: portfolioError, fetchPortfolioById } = usePortfolioData();
  const { properties, loading: propertiesLoading, error: propertiesError, fetchProperties } = usePropertyData();
  const [initialized, setInitialized] = useState(false);
  const [portfolioProperties, setPortfolioProperties] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (authInitialized || user?.user_portfolio_id) {
        await Promise.all([fetchProperties(), fetchPortfolioById(user?.user_portfolio_id)]);
        setInitialized(true);
      }
    };
    init();
  }, [authInitialized, user?.user_portfolio_id]);

  useEffect(() => {
    if (portfolio && properties && properties.length > 0) {
      const validIds = portfolio.portfolio_property_ids || [];

      const filteredAndSortedProps = properties
        .filter((prop) => validIds.includes(prop.property_id))
        .sort((a, b) => {
          const nameA = a.property_name || '';
          const nameB = b.property_name || '';
          return nameA.localeCompare(nameB, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        });

      setPortfolioProperties(filteredAndSortedProps);
    }
  }, [portfolio, properties]);

  const loading = portfolioLoading || propertiesLoading;
  const error = portfolioError || propertiesError;

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        properties: portfolioProperties,
        loading,
        error,
        initialized
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};