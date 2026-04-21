import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFonts } from '../../config/theme';

const NativeSchematicDragContext = createContext({
  beginDrag: () => {},
  updateDrag: () => {},
  endDrag: () => {},
  registerDropHandler: () => () => {},
});

export const useNativeSchematicDrag = () => useContext(NativeSchematicDragContext);

export function NativeSchematicDragProvider({ children }) {
  const theme = useTheme();
  const dropHandlerRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  const beginDrag = useCallback((item, pageX, pageY) => {
    setDragState({ item, pageX, pageY });
  }, []);

  const updateDrag = useCallback((pageX, pageY) => {
    setDragState((current) => (current ? { ...current, pageX, pageY } : current));
  }, []);

  const endDrag = useCallback((pageX, pageY) => {
    const current = dragState;
    setDragState(null);

    if (current?.item && dropHandlerRef.current) {
      dropHandlerRef.current(current.item, pageX, pageY);
    }
  }, [dragState]);

  const registerDropHandler = useCallback((handler) => {
    dropHandlerRef.current = handler;
    return () => {
      if (dropHandlerRef.current === handler) {
        dropHandlerRef.current = null;
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      beginDrag,
      updateDrag,
      endDrag,
      registerDropHandler,
    }),
    [beginDrag, endDrag, registerDropHandler, updateDrag]
  );

  return (
    <NativeSchematicDragContext.Provider value={value}>
      {children}

      <Modal transparent visible={!!dragState} animationType="none">
        <View pointerEvents="none" style={styles.overlay}>
          {dragState ? (
            <View
              style={[
                styles.dragCard,
                {
                  top: dragState.pageY - 22,
                  left: dragState.pageX - 90,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                  shadowColor: theme.colors.shadow,
                },
              ]}
            >
              <Icon
                name={dragState.item.iconName}
                size={18}
                color={dragState.item.iconColor || theme.colors.onSurface}
              />
              <Text
                style={[
                  styles.dragCardText,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: appFonts.bold.fontFamily,
                  },
                ]}
              >
                {dragState.item.label}
              </Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </NativeSchematicDragContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  dragCard: {
    position: 'absolute',
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    opacity: 0.95,
  },
  dragCardText: {
    fontSize: 12,
  },
});
