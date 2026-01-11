import { ScrollView, Text, View, Pressable, Alert, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useBusiness } from '@/lib/business-context';
import { clearAllData, exportData } from '@/lib/storage';
import * as Haptics from 'expo-haptics';
import type { Currency, Language, ThemeMode } from '@/types/business';

/**
 * Settings Screen - App-Einstellungen
 */
export default function SettingsScreen() {
  const colors = useColors();
  const { settings, updateSettings } = useBusiness();

  const handleCurrencyChange = (currency: Currency) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateSettings({ currency });
  };

  const handleLanguageChange = (language: Language) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateSettings({ language });
  };

  const handleThemeChange = (theme: ThemeMode) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateSettings({ theme });
  };

  const handleClearData = () => {
    Alert.alert(
      'Alle Daten löschen',
      'Möchten Sie wirklich alle App-Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Alle Daten löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Erfolg', 'Alle Daten wurden gelöscht.');
            } catch (error) {
              Alert.alert('Fehler', 'Fehler beim Löschen der Daten');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      // In einer echten App würde man hier einen Share-Dialog öffnen
      // Für diese Demo zeigen wir nur eine Bestätigung
      Alert.alert('Export', 'Daten wurden exportiert (Funktion in Entwicklung)');
      console.log('Exported data:', data);
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Exportieren der Daten');
    }
  };

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'CHF'];
  const languages: Language[] = ['de', 'en'];
  const themes: ThemeMode[] = ['light', 'dark', 'auto'];

  const getCurrencyLabel = (currency: Currency): string => {
    const labels: Record<Currency, string> = {
      USD: '$ US-Dollar',
      EUR: '€ Euro',
      GBP: '£ Pfund',
      CHF: 'CHF Schweizer Franken',
    };
    return labels[currency];
  };

  const getLanguageLabel = (language: Language): string => {
    const labels: Record<Language, string> = {
      de: 'Deutsch',
      en: 'English',
    };
    return labels[language];
  };

  const getThemeLabel = (theme: ThemeMode): string => {
    const labels: Record<ThemeMode, string> = {
      light: 'Hell',
      dark: 'Dunkel',
      auto: 'Automatisch',
    };
    return labels[theme];
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground">Einstellungen</Text>

          {/* Präferenzen */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Präferenzen</Text>

            {/* Währung */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-3">Währung</Text>
              <View className="gap-2">
                {currencies.map((currency) => (
                  <Pressable
                    key={currency}
                    onPress={() => handleCurrencyChange(currency)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View
                      className="flex-row items-center justify-between bg-surface rounded-xl px-4 py-3 border"
                      style={{
                        borderColor:
                          settings.currency === currency ? colors.primary : colors.border,
                      }}
                    >
                      <Text className="text-base text-foreground">
                        {getCurrencyLabel(currency)}
                      </Text>
                      {settings.currency === currency && (
                        <View
                          className="w-5 h-5 rounded-full items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-xs text-background font-bold">✓</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Sprache */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-3">Sprache</Text>
              <View className="gap-2">
                {languages.map((language) => (
                  <Pressable
                    key={language}
                    onPress={() => handleLanguageChange(language)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View
                      className="flex-row items-center justify-between bg-surface rounded-xl px-4 py-3 border"
                      style={{
                        borderColor:
                          settings.language === language ? colors.primary : colors.border,
                      }}
                    >
                      <Text className="text-base text-foreground">
                        {getLanguageLabel(language)}
                      </Text>
                      {settings.language === language && (
                        <View
                          className="w-5 h-5 rounded-full items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-xs text-background font-bold">✓</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Theme */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-3">Design</Text>
              <View className="gap-2">
                {themes.map((theme) => (
                  <Pressable
                    key={theme}
                    onPress={() => handleThemeChange(theme)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View
                      className="flex-row items-center justify-between bg-surface rounded-xl px-4 py-3 border"
                      style={{
                        borderColor:
                          settings.theme === theme ? colors.primary : colors.border,
                      }}
                    >
                      <Text className="text-base text-foreground">
                        {getThemeLabel(theme)}
                      </Text>
                      {settings.theme === theme && (
                        <View
                          className="w-5 h-5 rounded-full items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-xs text-background font-bold">✓</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Daten */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Daten</Text>

            <Pressable
              onPress={handleExportData}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="bg-surface rounded-xl px-4 py-3 border border-border">
                <Text className="text-base text-foreground">Daten exportieren</Text>
                <Text className="text-xs text-muted mt-1">
                  Exportiert alle Analysen und Einstellungen
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleClearData}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                className="bg-surface rounded-xl px-4 py-3 border"
                style={{ borderColor: colors.error }}
              >
                <Text className="text-base" style={{ color: colors.error }}>
                  Alle Daten löschen
                </Text>
                <Text className="text-xs text-muted mt-1">
                  Löscht alle Analysen, Verlauf und Einstellungen
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Info */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Info</Text>

            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm text-muted mb-2">App-Version</Text>
              <Text className="text-base text-foreground font-semibold">1.0.0</Text>
            </View>

            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm text-muted mb-2">Über die App</Text>
              <Text className="text-sm text-foreground leading-relaxed">
                Business Health Score analysiert die Effizienz Ihres Unternehmens in 5
                Schlüsselbereichen und zeigt versteckte Umsatzpotenziale auf.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
