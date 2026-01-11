import { ScrollView, Text, View, Pressable, Platform, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { InputField } from '@/components/ui/input-field';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { ToggleField } from '@/components/ui/toggle-field';
import { useBusiness } from '@/lib/business-context';
import { calculateBusinessHealth } from '@/lib/calculations';
import { validateBusinessInput } from '@/lib/validation';
import type { BusinessInputData, Channel } from '@/types/business';
import { router } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

/**
 * Input Screen - Dateneingabe-Formular
 */
export default function InputScreen() {
  const { saveAnalysis, benchmarks } = useBusiness();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<BusinessInputData>({
    totalCustomers: 0,
    averageProjectValue: 0,
    contactFrequencyPerYear: 0,
    hasReactivationProcess: false,
    googleStarRating: 0,
    reviewResponseRate: 0,
    sharesReviewsOnSocialMedia: false,
    dailyCalls: 0,
    callAnswerRate: 0,
    hasAfterHoursHandling: false,
    availableChannels: [],
    averageResponseTimeHours: 0,
    monthlyWebsiteVisitors: 0,
    conversionRate: 0,
    isMobileOptimized: false,
    hasAutomatedFollowUp: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const channelOptions = [
    { value: 'phone', label: 'Telefon' },
    { value: 'email', label: 'E-Mail' },
    { value: 'live_chat', label: 'Live-Chat' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'sms', label: 'SMS' },
  ];

  const handleInputChange = (field: keyof BusinessInputData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleToggleChange = (field: keyof BusinessInputData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChannelsChange = (channels: string[]) => {
    setFormData((prev) => ({ ...prev, availableChannels: channels as Channel[] }));
    if (errors.availableChannels) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.availableChannels;
        return newErrors;
      });
    }
  };

  const handleCalculate = async () => {
    // Validierung
    const validation = validateBusinessInput(formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      Alert.alert('Validierungsfehler', 'Bitte überprüfen Sie Ihre Eingaben.');
      return;
    }

    try {
      setLoading(true);
      
      // Berechne Score
      const result = calculateBusinessHealth(formData, benchmarks);
      
      // Speichere Analyse
      await saveAnalysis(result);
      
      // Navigiere zu Results
      router.replace('/results');
    } catch (error) {
      console.error('Error calculating score:', error);
      Alert.alert('Fehler', 'Fehler bei der Berechnung. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Geschäftsdaten eingeben
            </Text>
            <Text className="text-sm text-muted">
              Füllen Sie alle Felder aus, um Ihren Business Health Score zu berechnen.
            </Text>
          </View>

          {/* Säule 1: Datenbank */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              1. Datenbank
            </Text>
            
            <InputField
              label="Gesamtzahl Kunden"
              placeholder="z.B. 3200"
              keyboardType="numeric"
              value={formData.totalCustomers > 0 ? formData.totalCustomers.toString() : ''}
              onChangeText={(val) => handleInputChange('totalCustomers', val)}
              error={errors.totalCustomers}
            />
            
            <InputField
              label="Durchschnittlicher Projektwert ($)"
              placeholder="z.B. 4500"
              keyboardType="numeric"
              value={formData.averageProjectValue > 0 ? formData.averageProjectValue.toString() : ''}
              onChangeText={(val) => handleInputChange('averageProjectValue', val)}
              error={errors.averageProjectValue}
            />
            
            <InputField
              label="Kontaktfrequenz pro Jahr"
              placeholder="z.B. 12 (monatlich)"
              keyboardType="numeric"
              value={formData.contactFrequencyPerYear > 0 ? formData.contactFrequencyPerYear.toString() : ''}
              onChangeText={(val) => handleInputChange('contactFrequencyPerYear', val)}
              error={errors.contactFrequencyPerYear}
              helperText="Wie oft kontaktieren Sie Ihre Kunden pro Jahr?"
            />
            
            <ToggleField
              label="Haben Sie einen Prozess zur Reaktivierung ehemaliger Kunden?"
              value={formData.hasReactivationProcess}
              onChange={(val) => handleToggleChange('hasReactivationProcess', val)}
              helperText="Z.B. automatisierte E-Mail-Kampagnen, Anrufe, etc."
            />
          </View>

          {/* Säule 2: Reputation */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              2. Reputation
            </Text>
            
            <InputField
              label="Google-Sternebewertung"
              placeholder="z.B. 4.2"
              keyboardType="decimal-pad"
              value={formData.googleStarRating > 0 ? formData.googleStarRating.toString() : ''}
              onChangeText={(val) => handleInputChange('googleStarRating', val)}
              error={errors.googleStarRating}
              helperText="Bewertung von 1.0 bis 5.0"
            />
            
            <InputField
              label="Antwortrate auf Bewertungen (%)"
              placeholder="z.B. 22"
              keyboardType="numeric"
              value={formData.reviewResponseRate > 0 ? formData.reviewResponseRate.toString() : ''}
              onChangeText={(val) => handleInputChange('reviewResponseRate', val)}
              error={errors.reviewResponseRate}
            />
            
            <ToggleField
              label="Teilen Sie positive Bewertungen auf Social Media?"
              value={formData.sharesReviewsOnSocialMedia}
              onChange={(val) => handleToggleChange('sharesReviewsOnSocialMedia', val)}
              helperText="Z.B. auf Facebook, Instagram, LinkedIn, etc."
            />
          </View>

          {/* Säule 3: Lead Capture */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              3. Lead Capture
            </Text>
            
            <InputField
              label="Tägliche Anrufe"
              placeholder="z.B. 50"
              keyboardType="numeric"
              value={formData.dailyCalls > 0 ? formData.dailyCalls.toString() : ''}
              onChangeText={(val) => handleInputChange('dailyCalls', val)}
              error={errors.dailyCalls}
            />
            
            <InputField
              label="Anrufannahmequote (%)"
              placeholder="z.B. 68"
              keyboardType="numeric"
              value={formData.callAnswerRate > 0 ? formData.callAnswerRate.toString() : ''}
              onChangeText={(val) => handleInputChange('callAnswerRate', val)}
              error={errors.callAnswerRate}
            />
            
            <ToggleField
              label="Was passiert nach Feierabend/am Wochenende bei Anrufen?"
              value={formData.hasAfterHoursHandling}
              onChange={(val) => handleToggleChange('hasAfterHoursHandling', val)}
              helperText="Haben Sie Anrufbeantworter, Weiterleitungen oder andere Lösungen?"
            />
          </View>

          {/* Säule 4: Omnichannel */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              4. Omnichannel
            </Text>
            
            <CheckboxGroup
              label="Verfügbare Kommunikationskanäle"
              options={channelOptions}
              selectedValues={formData.availableChannels}
              onChange={handleChannelsChange}
              error={errors.availableChannels}
            />
            
            <InputField
              label="Durchschnittliche Antwortzeit (Stunden)"
              placeholder="z.B. 2"
              keyboardType="numeric"
              value={formData.averageResponseTimeHours > 0 ? formData.averageResponseTimeHours.toString() : ''}
              onChangeText={(val) => handleInputChange('averageResponseTimeHours', val)}
              error={errors.averageResponseTimeHours}
              helperText="Über alle Kanäle hinweg (E-Mail, Chat, Social Media, etc.)"
            />
          </View>

          {/* Säule 5: Website */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              5. Website
            </Text>
            
            <InputField
              label="Monatliche Website-Besucher"
              placeholder="z.B. 5000"
              keyboardType="numeric"
              value={formData.monthlyWebsiteVisitors > 0 ? formData.monthlyWebsiteVisitors.toString() : ''}
              onChangeText={(val) => handleInputChange('monthlyWebsiteVisitors', val)}
              error={errors.monthlyWebsiteVisitors}
            />
            
            <InputField
              label="Konversionsrate (%)"
              placeholder="z.B. 2.8"
              keyboardType="decimal-pad"
              value={formData.conversionRate > 0 ? formData.conversionRate.toString() : ''}
              onChangeText={(val) => handleInputChange('conversionRate', val)}
              error={errors.conversionRate}
            />
            
            <ToggleField
              label="Ist Ihre Website für mobile Endgeräte optimiert?"
              value={formData.isMobileOptimized}
              onChange={(val) => handleToggleChange('isMobileOptimized', val)}
              helperText="Responsive Design, schnelle Ladezeiten auf Smartphones"
            />
            
            <ToggleField
              label="Automatisierte Follow-up-Sequenzen nach Formular-Ausfüllung?"
              value={formData.hasAutomatedFollowUp}
              onChange={(val) => handleToggleChange('hasAutomatedFollowUp', val)}
              helperText="Z.B. automatische E-Mails, SMS oder Anrufe nach Lead-Erfassung"
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-6 border-t border-border"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-row gap-3">
          {/* Abbrechen Button */}
          <View className="flex-1">
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                handleCancel();
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                backgroundColor: colors.surface,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderWidth: 2,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Text 
                className="text-base font-bold"
                style={{ color: colors.muted }}
              >
                Abbrechen
              </Text>
            </Pressable>
          </View>
          
          {/* Berechnen Button */}
          <View className="flex-1">
            <Pressable
              onPress={() => {
                if (!loading) {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  handleCalculate();
                }
              }}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed && !loading ? 0.9 : loading ? 0.7 : 1,
                transform: [{ scale: pressed && !loading ? 0.98 : 1 }],
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text className="text-base font-bold text-background">
                  Berechnen
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
