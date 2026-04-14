import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

// Import your custom components (adjust paths as needed)
import AuthFooter from './AuthFooter'; // Update path
import AuthCard from './AuthCard';
import AuthBackground from './AuthBackground';

const { height: screenHeight } = Dimensions.get('window');

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
   React.useEffect(() => {
        console.log("🔄 AuthWrapper mounted");
        return () => console.log("🔄 AuthWrapper unmounted");
    }, []);
  return (
    <View style={styles.container}>
      {/* Background component */}
      <AuthBackground />
      
      <View style={styles.mainContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.contentContainer}>
              {/* Main content area with AuthCard */}
              <View style={styles.mainContentArea}>
                <AuthCard>{children}</AuthCard>
              </View>
              
              {/* Footer */}
              <View style={styles.footerContainer}>
                <AuthFooter />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </View>
  );
}

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

// Alternative version with dynamic height calculation
export const DynamicAuthWrapper = ({ children }) => {
  const [layoutHeight, setLayoutHeight] = React.useState(screenHeight);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setLayoutHeight(height);
  };

  // Calculate dynamic min heights based on screen size
  const getDynamicMinHeight = () => {
    const footerHeight = 112; // Approximate footer height
    const headerOffset = Platform.OS === 'ios' ? 20 : 0;
    
    if (screenHeight <= 600) {
      return screenHeight - footerHeight - headerOffset - 40;
    } else if (screenHeight <= 900) {
      return screenHeight - footerHeight - headerOffset - 30;
    } else {
      return screenHeight - footerHeight - headerOffset - 20;
    }
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <AuthBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent,
              { minHeight: getDynamicMinHeight() }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.contentContainer}>
                <View style={styles.mainContentArea}>
                  <AuthCard>{children}</AuthCard>
                </View>
                
                <View style={styles.footerContainer}>
                  <AuthFooter />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

DynamicAuthWrapper.propTypes = {
  children: PropTypes.node,
};

// Version with custom hooks for responsive design
export const useResponsiveAuthWrapper = () => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const getResponsiveStyles = () => {
    const { height, width } = dimensions;
    const isSmall = height <= 600;
    const isMedium = height > 600 && height <= 800;
    const isLarge = height > 800;

    let minHeight;
    if (isSmall) {
      minHeight = height - 210;
    } else if (isMedium) {
      minHeight = height - 134;
    } else {
      minHeight = height - 112;
    }

    return {
      minHeight,
      footerMargin: isSmall ? 12 : 16,
      containerPadding: isSmall ? 8 : 16,
    };
  };

  return { dimensions, getResponsiveStyles };
};

export const ResponsiveAuthWrapper = ({ children }) => {
  const { getResponsiveStyles } = useResponsiveAuthWrapper();
  const styles = getResponsiveStyles();

  return (
    <View style={[containerStyles.container, { paddingHorizontal: styles.containerPadding }]}>
      <AuthBackground />
      
      <SafeAreaView style={containerStyles.safeArea}>
        <View style={containerStyles.mainContainer}>
          <ScrollView 
            contentContainerStyle={[
              containerStyles.scrollContent,
              { minHeight: styles.minHeight }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={containerStyles.keyboardAvoidingView}
            >
              <View style={containerStyles.contentContainer}>
                <View style={containerStyles.mainContentArea}>
                  <AuthCard>{children}</AuthCard>
                </View>
                
                <View style={[containerStyles.footerContainer, { margin: styles.footerMargin }]}>
                  <AuthFooter />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

ResponsiveAuthWrapper.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#f3f7fd',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerContainer: {
    margin: 12,
    marginTop: 4,
  },
});

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 4,
  },
});