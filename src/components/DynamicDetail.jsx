import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ContentDetail from './ContentDetail';
import { getContentByIdRemote } from '../services/contentService';
import { theme } from '../theme';

export default function DynamicDetail({ type, eyebrow }) {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setErrorMessage('');
      const result = await getContentByIdRemote(type, id);
      if (!active) return;
      setItem(result.data);
      if (result.error) {
        setErrorMessage('Showing saved local content while the online directory is unavailable.');
      }
      setLoading(false);
    };

    load();
    return () => { active = false; };
  }, [type, id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  return <ContentDetail item={item} eyebrow={eyebrow} notice={errorMessage} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { color: theme.colors.muted },
});
