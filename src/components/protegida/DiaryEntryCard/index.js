import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

const iconByType = {
  note: 'document-text-outline',

  audio: 'mic-outline',

  photo: 'camera-outline',
};

const DiaryEntryCard = ({ type = 'note', title, description, date, onDelete }) => {
  const icon = iconByType[type] || iconByType.note;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={30} color="#FFFFFF" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {description ? <Text style={styles.description}>{description}</Text> : null}

        <Text style={styles.date}>{date}</Text>
      </View>

      <Pressable
        onPress={onDelete}

        style={styles.deleteButton}

        accessibilityRole="button"

        accessibilityLabel={`Excluir ${title}`}
      >
        <Ionicons
          name="close"

          size={27}

          color="#555555"
        />
      </Pressable>
    </View>
  );
};

export default DiaryEntryCard;
