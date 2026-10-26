import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { categories, colors, noteColors } from '../theme';

export function NoteEditorScreen({ note, onBack, onSave }) {
  const [title, setTitle] = useState(note.title ?? '');
  const [content, setContent] = useState(note.content ?? '');
  const [category, setCategory] = useState(note.category ?? 'Personal');
  const [color, setColor] = useState(note.color ?? 'cream');
  const [validationMessage, setValidationMessage] = useState('');
  const isEditing = Boolean(note.id);
  const selectedColor =
    noteColors.find((option) => option.name === color)?.value ??
    colors.note.cream;

  function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      setValidationMessage('Add a title or a few words before saving.');
      return;
    }

    onSave({
      title: trimmedTitle || 'Untitled',
      content: trimmedContent,
      category,
      color,
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.ink} name="arrow-left" size={20} />
        </Pressable>
        <Text style={styles.topBarTitle}>
          {isEditing ? 'Edit note' : 'New note'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save note"
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.noteSheet, { backgroundColor: selectedColor }]}>
          <TextInput
            accessibilityLabel="Note title"
            maxLength={120}
            multiline
            onChangeText={(value) => {
              setTitle(value);
              setValidationMessage('');
            }}
            placeholder="Give your note a title"
            placeholderTextColor="#96938A"
            style={styles.titleInput}
            value={title}
          />
          <View style={styles.divider} />
          <TextInput
            accessibilityLabel="Note content"
            multiline
            onChangeText={(value) => {
              setContent(value);
              setValidationMessage('');
            }}
            placeholder="Start writing..."
            placeholderTextColor="#96938A"
            scrollEnabled={false}
            style={styles.contentInput}
            textAlignVertical="top"
            value={content}
          />
        </View>

        {validationMessage ? (
          <Text accessibilityRole="alert" style={styles.validation}>
            {validationMessage}
          </Text>
        ) : null}

        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.categoryList}>
          {categories.map((option) => {
            const isSelected = category === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setCategory(option)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>PAPER COLOR</Text>
        <View style={styles.colorList}>
          {noteColors.map((option) => {
            const isSelected = color === option.name;
            return (
              <Pressable
                key={option.name}
                accessibilityRole="button"
                accessibilityLabel={`${option.name} note color`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setColor(option.name)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: option.value },
                  isSelected && styles.colorSwatchSelected,
                ]}
              >
                {isSelected && (
                  <Feather color={colors.ink} name="check" size={15} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  topBarTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 68,
    paddingHorizontal: 15,
  },
  saveLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 36,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  noteSheet: {
    borderColor: 'rgba(35, 35, 31, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 310,
    padding: 20,
  },
  titleInput: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    minHeight: 38,
    paddingHorizontal: 0,
    paddingVertical: 3,
  },
  divider: {
    backgroundColor: 'rgba(35, 35, 31, 0.12)',
    height: 1,
    marginVertical: 13,
  },
  contentInput: {
    color: '#4F4E48',
    fontSize: 15,
    lineHeight: 24,
    minHeight: 205,
    padding: 0,
  },
  validation: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 10,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 25,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  categoryChip: {
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  categoryChipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  categoryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: colors.white,
  },
  colorList: {
    flexDirection: 'row',
    gap: 13,
  },
  colorSwatch: {
    alignItems: 'center',
    borderColor: 'rgba(35, 35, 31, 0.12)',
    borderRadius: 19,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  colorSwatchSelected: {
    borderColor: colors.ink,
    borderWidth: 2,
  },
});