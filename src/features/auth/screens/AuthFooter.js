import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  const { tokens } = useAppTheme();
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Links container */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => handleLinkPress('https://acaciagreentechnologies.co.uk/')}>
            <Text style={[styles.linkText, { color: tokens.info }]}>Terms and Conditions</Text>
          </TouchableOpacity>
         
         <TouchableOpacity onPress={() => handleLinkPress('https://acaciagreentechnologies.co.uk/')}>
            <Text style={[styles.linkText, { color: tokens.info }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright text */}
        <Text style={[styles.copyrightText, { color: tokens.text }]}>
          Copyright © Acacia Green Technologies Ltd. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linksContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textDecorationLine: 'underline',
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
});

// Alternative responsive version with different layout on larger screens (tablet/desktop)
export const ResponsiveAuthFooter = () => {
  const { tokens } = useAppTheme();
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.contentContainer}>
        <View style={responsiveStyles.linksContainer}>
          <TouchableOpacity onPress={() => handleLinkPress('https://acaciagreentechnologies.co.uk/')}>
            <Text style={[responsiveStyles.linkText, { color: tokens.info }]}>Terms and Conditions</Text>
          </TouchableOpacity>
         
         <TouchableOpacity onPress={() => handleLinkPress('https://acaciagreentechnologies.co.uk/')}>
            <Text style={[responsiveStyles.linkText, { color: tokens.info }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <Text style={[responsiveStyles.copyrightText, { color: tokens.text }]}>
          Copyright © Acacia Green Technologies Ltd. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

const responsiveStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textDecorationLine: 'underline',
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
});
