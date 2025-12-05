import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

interface PublicHeaderProps {
  onLoginPress: () => void;
  title?: string;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ 
  onLoginPress, 
  title = 'SGA' 
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#9b59b6', '#8e44ad']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onLoginPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ffffff', '#f0f0f0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonIcon}>👤</Text>
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#9b59b6',
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  loginButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  loginButtonIcon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  loginButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
});

export default PublicHeader;
