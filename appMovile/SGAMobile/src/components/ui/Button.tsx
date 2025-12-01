import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, shadows, spacing, fontSizes, borderRadius } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return { gradient: gradients.primary, textColor: colors.textWhite };
      case 'secondary':
        return { gradient: gradients.purple, textColor: colors.textWhite };
      case 'success':
        return { gradient: gradients.success, textColor: colors.textWhite };
      case 'error':
        return { gradient: gradients.error, textColor: colors.textWhite };
      case 'outline':
        return { gradient: null, textColor: colors.primary };
      case 'ghost':
        return { gradient: null, textColor: colors.primary };
      default:
        return { gradient: gradients.primary, textColor: colors.textWhite };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, fontSize: fontSizes.sm };
      case 'medium':
        return { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, fontSize: fontSizes.md };
      case 'large':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: fontSizes.lg };
      default:
        return { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, fontSize: fontSizes.md };
    }
  };

  const { gradient, textColor } = getButtonColors();
  const sizeStyles = getSizeStyles();

  const buttonContent = (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {gradient && !disabled ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal }
          ]}
        >
          <ButtonContent
            icon={icon}
            loading={loading}
            title={title}
            textColor={textColor}
            fontSize={sizeStyles.fontSize}
          />
        </LinearGradient>
      ) : (
        <ButtonContent
          icon={icon}
          loading={loading}
          title={title}
          textColor={disabled ? colors.gray400 : textColor}
          fontSize={sizeStyles.fontSize}
          style={{ paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal }}
        />
      )}
    </TouchableOpacity>
  );

  return buttonContent;
};

const ButtonContent: React.FC<{
  icon?: React.ReactNode;
  loading: boolean;
  title: string;
  textColor: string;
  fontSize: number;
  style?: ViewStyle;
}> = ({ icon, loading, title, textColor, fontSize, style }) => (
  <Text style={[styles.contentContainer, style]}>
    {loading ? (
      <ActivityIndicator color={textColor} size="small" />
    ) : (
      <>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
      </>
    )}
  </Text>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: colors.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
});
