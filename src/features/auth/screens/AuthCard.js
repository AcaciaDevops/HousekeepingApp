import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';

export default function AuthCard({ children }) {
  const { tokens } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: tokens.surface, borderColor: tokens.border }]}>
      {children}
    </View>
  );
}

AuthCard.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
});
