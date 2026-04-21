import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { usePlantRoomData } from '../../hooks/DevicesAndAppliances/usePlantRoomData';
import { useActivePropertyContext } from '../../hooks/contexts/ActivePropertyContext';
import SchematicBuilder from '../../components/plantroom/SchematicBuilder';
import SchematicLibrary from '../../components/plantroom/SchematicLibrary';
import { NativeSchematicDragProvider } from '../../components/plantroom/NativeSchematicDragContext';

const { height: screenHeight } = Dimensions.get('window');

export default function PlantRoomHeating() {
  const plantRoomData = usePlantRoomData();
  const { activeProperty } = useActivePropertyContext();
  const propertyId = activeProperty?.property_id;
  const [isDesignMode, setIsDesignMode] = useState(false);
  const theme = useTheme();

  if (!propertyId) {
    return (
      <View style={styles.noPropertyContainer}>
        <Text variant="bodyLarge">
          Please select a property.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.breadcrumbsContainer}>
          {/* Replace with your actual Breadcrumbs component */}
          <Text variant="headlineMedium" style={styles.heading}>
            Plant Room - Heating
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode={isDesignMode ? 'contained' : 'outlined'}
            onPress={() => setIsDesignMode(!isDesignMode)}
            icon={isDesignMode ? 'eye' : 'pencil'}
            buttonColor={isDesignMode ? theme.colors.primary : undefined}
          >
            {isDesignMode ? 'Exit Design Mode' : 'Edit Schematic'}
          </Button>
        </View>
      </View>

      {/* Content Section */}
      <NativeSchematicDragProvider>
        <View style={styles.contentContainer}>
          <View style={[
            styles.schematicContainer,
            isDesignMode && styles.schematicContainerWithLibrary
          ]}>
            <Card style={styles.card} contentStyle={styles.cardContent}>
              <SchematicBuilder 
                propertyId={propertyId} 
                graphicType="heating" 
                readOnly={!isDesignMode} 
                {...plantRoomData} 
              />
            </Card>
          </View>

          {isDesignMode && (
            <View style={styles.libraryContainer}>
              <Card style={styles.card} contentStyle={styles.cardContent}>
                <SchematicLibrary />
              </Card>
            </View>
          )}
        </View>
      </NativeSchematicDragProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noPropertyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  breadcrumbsContainer: {
    flex: 1,
    marginBottom: 8,
  },
  heading: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
  },
  schematicContainer: {
    flex: 1,
  },
  schematicContainerWithLibrary: {
    flex: 0.75, // 9/12 ratio
    marginRight: 8,
  },
  libraryContainer: {
    flex: 0.25, // 3/12 ratio
    marginLeft: 8,
  },
  card: {
    flex: 1,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    padding: 0,
  },
});
