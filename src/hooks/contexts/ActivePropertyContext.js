import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePortfolioContext } from './PortfolioContext';

const ActivePropertyContext = createContext();

export const useActivePropertyContext = () => useContext(ActivePropertyContext);

const LAST_ACTIVE_PROPERTY_KEY = 'lastActivePropertyId';

export const ActivePropertyProvider = ({ children }) => {
  const { properties, initialized } = usePortfolioContext();
  console.log("properties::", properties);
  console.log("initialized::", initialized);
  const [activeProperty, setActiveProperty] = useState(null);
  const [initialPropertySet, setInitialPropertySet] = useState(false);

  useEffect(() => {
    const loadInitialProperty = async () => {
      if (initialized && properties.length > 0) {
        try {
          const storedLastActivePropertyId = await AsyncStorage.getItem(LAST_ACTIVE_PROPERTY_KEY);
          let foundProperty = null;

          if (storedLastActivePropertyId) {
            foundProperty = properties.find(
              (p) => String(p.property_id) === String(storedLastActivePropertyId)
            );
          }

          if (foundProperty) {
            setActiveProperty(foundProperty);
          } else {
            const sorted = [...properties].sort((a, b) =>
              a.property_name.localeCompare(b.property_name, undefined, {
                numeric: true,
                sensitivity: 'base',
              })
            );
            setActiveProperty(sorted[0]);
          }

          setInitialPropertySet(true);
        } catch (error) {
          console.error('Error loading active property:', error);
          setInitialPropertySet(true);
        }
      } else if (initialized && properties.length === 0 && !initialPropertySet) {
        setActiveProperty(null);
        setInitialPropertySet(true);
      }
    };

    loadInitialProperty();
  }, [properties, initialized, initialPropertySet]);

  useEffect(() => {
    const saveActiveProperty = async () => {
      try {
        if (activeProperty) {
          await AsyncStorage.setItem(LAST_ACTIVE_PROPERTY_KEY, String(activeProperty.property_id));
        } else if (initialPropertySet) {
          await AsyncStorage.removeItem(LAST_ACTIVE_PROPERTY_KEY);
        }
      } catch (error) {
        console.error('Error saving active property:', error);
      }
    };

    saveActiveProperty();
  }, [activeProperty, initialPropertySet]);

  return (
    <ActivePropertyContext.Provider value={{ activeProperty, setActiveProperty }}>
      {children}
    </ActivePropertyContext.Provider>
  );
};