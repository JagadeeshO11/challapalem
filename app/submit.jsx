import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { submitContent, validateSubmission } from '../src/services/submissionService.js';
import { theme } from '../src/theme';

const typeOptions = [
  ['place', 'Place'],
  ['event', 'Event'],
  ['business', 'Business'],
  ['community', 'Community'],
];

export default function SubmitScreen() {
  const [form, setForm] = useState({ type: 'place', title: '', category: '', description: '', details: '', dateText: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async () => {
    const validation = validateSubmission(form);
    setErrors(validation.errors);
    setSubmitError('');
    setSuccess(false);
    if (!validation.valid) return;

    setBusy(true);
    const result = await submitContent(form);
    setBusy(false);
    if (result.error) {
      setSubmitError(result.error.message);
      return;
    }
    setSuccess(true);
    setForm({ type: 'place', title: '', category: '', description: '', details: '', dateText: '' });
  };

  const field = (key, label, placeholder, multiline = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={(value) => update(key, value)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline, errors[key] && styles.invalid]}
        maxLength={key === 'title' ? 160 : key === 'description' ? 1000 : key === 'category' ? 80 : key === 'dateText' ? 120 : 5000}
      />
      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Suggest content', headerShown: false }} />
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.eyebrow}>COMMUNITY</Text>
      <Text style={styles.title}>Suggest something for Challapalle</Text>
      <Text style={styles.description}>Share a place, event, business, or community initiative. Every suggestion is reviewed before it appears publicly.</Text>

      <Text style={styles.label}>What are you sharing?</Text>
      <View style={styles.types}>
        {typeOptions.map(([value, label]) => (
          <Pressable key={value} onPress={() => update('type', value)} style={[styles.typeButton, form.type === value && styles.typeSelected]}>
            <Text style={[styles.typeText, form.type === value && styles.typeSelectedText]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {field('title', 'Title', 'e.g. Sri Lakshmi Bakery')}
      {field('category', 'Category (optional)', 'e.g. Food, Education, Festival')}
      {field('description', 'Description', 'Tell people what makes it useful or special.', true)}
      {field('details', 'Details (optional)', 'Address, contact, timing, links, or other useful information.', true)}
      {field('dateText', 'Date / timing (optional)', 'e.g. Every Sunday, 6:00 PM')}

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
      {success ? (
        <View style={styles.success}><Text style={styles.successTitle}>Submitted for review ✓</Text><Text style={styles.successText}>Thanks. Your suggestion is pending review and will only become public after approval.</Text></View>
      ) : null}

      <Pressable disabled={busy} onPress={handleSubmit} style={[styles.submit, busy && styles.disabled]}>
        {busy ? <ActivityIndicator color={theme.colors.inverse} /> : <Text style={styles.submitText}>Send for review</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg, paddingTop: 48, maxWidth: 760, width: '100%', alignSelf: 'center', gap: 6 },
  back: { alignSelf: 'flex-start', marginBottom: 20, paddingVertical: 8, paddingHorizontal: 4 },
  backText: { color: theme.colors.primary, fontWeight: '700', fontSize: 15 },
  eyebrow: { color: theme.colors.accent, fontWeight: '800', letterSpacing: 1.5, fontSize: 12, marginBottom: 6 },
  title: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 34, lineHeight: 40, marginBottom: 10 },
  description: { color: theme.colors.muted, fontSize: 16, lineHeight: 25, marginBottom: 22 },
  label: { color: theme.colors.primaryDark, fontWeight: '800', fontSize: 14, marginTop: 10, marginBottom: 8 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeButton: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: theme.colors.surface },
  typeSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  typeText: { color: theme.colors.primaryDark, fontWeight: '700' },
  typeSelectedText: { color: theme.colors.inverse },
  field: { marginBottom: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, paddingHorizontal: 14, paddingVertical: 12, color: theme.colors.primaryDark, fontSize: 15 },
  multiline: { minHeight: 120 },
  invalid: { borderColor: '#B64A3A' },
  error: { color: '#B64A3A', fontSize: 12, marginTop: 5 },
  submitError: { color: '#B64A3A', backgroundColor: '#FBEDEA', padding: 12, borderRadius: theme.radius.sm, marginTop: 8 },
  success: { backgroundColor: '#EAF4EC', borderWidth: 1, borderColor: '#BBD9C1', padding: 16, borderRadius: theme.radius.md, marginTop: 10 },
  successTitle: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 16 },
  successText: { color: theme.colors.muted, lineHeight: 21, marginTop: 4 },
  submit: { minHeight: 52, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 40 },
  submitText: { color: theme.colors.inverse, fontWeight: '900', fontSize: 16 },
  disabled: { opacity: 0.65 },
});
