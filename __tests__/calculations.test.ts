import { describe, it, expect } from 'vitest';
import { calculateBusinessHealth, DEFAULT_BENCHMARKS } from '@/lib/calculations';
import type { BusinessInputData } from '@/types/business';

describe('Business Health Score Calculations', () => {
  const mockInputData: BusinessInputData = {
    totalCustomers: 3200,
    averageProjectValue: 4500,
    contactFrequencyPerYear: 1,
    hasReactivationProcess: false,
    googleStarRating: 4.2,
    reviewResponseRate: 22,
    sharesReviewsOnSocialMedia: false,
    dailyCalls: 50,
    callAnswerRate: 68,
    hasAfterHoursHandling: false,
    availableChannels: ['phone', 'email'],
    averageResponseTimeHours: 4,
    monthlyWebsiteVisitors: 5000,
    conversionRate: 2.8,
    isMobileOptimized: false,
    hasAutomatedFollowUp: false,
  };

  it('should calculate total score correctly', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(500);
    expect(result.maxScore).toBe(500);
  });

  it('should calculate percentage correctly', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    const expectedPercentage = (result.totalScore / result.maxScore) * 100;
    expect(result.percentage).toBeCloseTo(expectedPercentage, 1);
  });

  it('should return 5 pillars', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    expect(result.pillars).toHaveLength(5);
    expect(result.pillars.map(p => p.name)).toEqual([
      'database',
      'reputation',
      'lead_capture',
      'omnichannel',
      'website',
    ]);
  });

  it('should calculate database score based on contact frequency', () => {
    const result = calculateBusinessHealth(mockInputData);
    const databasePillar = result.pillars.find(p => p.name === 'database');
    
    expect(databasePillar).toBeDefined();
    expect(databasePillar!.score).toBeGreaterThan(0);
    expect(databasePillar!.score).toBeLessThanOrEqual(100);
  });

  it('should calculate reputation score based on rating and response rate', () => {
    const result = calculateBusinessHealth(mockInputData);
    const reputationPillar = result.pillars.find(p => p.name === 'reputation');
    
    expect(reputationPillar).toBeDefined();
    expect(reputationPillar!.score).toBeGreaterThan(0);
    expect(reputationPillar!.score).toBeLessThanOrEqual(100);
  });

  it('should calculate lead capture score based on answer rate and after-hours handling', () => {
    const result = calculateBusinessHealth(mockInputData);
    const leadCapturePillar = result.pillars.find(p => p.name === 'lead_capture');
    
    expect(leadCapturePillar).toBeDefined();
    // 68% answer rate = 57.8 points (68 * 0.85), no after-hours = 0 bonus
    expect(leadCapturePillar!.score).toBeCloseTo(58, 0);
  });

  it('should calculate omnichannel score based on channel count and response time', () => {
    const result = calculateBusinessHealth(mockInputData);
    const omnichannelPillar = result.pillars.find(p => p.name === 'omnichannel');
    
    expect(omnichannelPillar).toBeDefined();
    // 2 channels = 28 points (2 * 14), 4 hours response = 20 points
    expect(omnichannelPillar!.score).toBe(48);
  });

  it('should calculate website score based on conversion rate', () => {
    const result = calculateBusinessHealth(mockInputData);
    const websitePillar = result.pillars.find(p => p.name === 'website');
    
    expect(websitePillar).toBeDefined();
    expect(websitePillar!.score).toBeGreaterThan(0);
    expect(websitePillar!.score).toBeLessThanOrEqual(100);
  });

  it('should calculate annual revenue loss', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    expect(result.annualRevenueLoss).toBeGreaterThan(0);
    expect(result.annualRevenueLoss).toBe(
      result.pillars.reduce((sum, p) => sum + p.revenueImpact, 0)
    );
  });

  it('should calculate daily opportunity cost', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    const expectedDaily = Math.round(result.annualRevenueLoss / 365);
    expect(result.dailyOpportunityCost).toBe(expectedDaily);
  });

  it('should assign correct status based on percentage', () => {
    // Critical status (<50%)
    const lowScoreData: BusinessInputData = {
      ...mockInputData,
      contactFrequencyPerYear: 0,
      hasReactivationProcess: false,
      googleStarRating: 1,
      reviewResponseRate: 0,
      sharesReviewsOnSocialMedia: false,
      callAnswerRate: 10,
      hasAfterHoursHandling: false,
      availableChannels: ['phone'],
      averageResponseTimeHours: 48,
      conversionRate: 0.5,
      isMobileOptimized: false,
      hasAutomatedFollowUp: false,
    };
    const lowResult = calculateBusinessHealth(lowScoreData);
    expect(lowResult.status).toBe('critical');

    // Good status (>80%)
    const highScoreData: BusinessInputData = {
      ...mockInputData,
      contactFrequencyPerYear: 12,
      hasReactivationProcess: true,
      googleStarRating: 4.8,
      reviewResponseRate: 90,
      sharesReviewsOnSocialMedia: true,
      callAnswerRate: 95,
      hasAfterHoursHandling: true,
      availableChannels: ['phone', 'email', 'live_chat', 'social_media', 'sms'],
      averageResponseTimeHours: 0.5,
      conversionRate: 5.5,
      isMobileOptimized: true,
      hasAutomatedFollowUp: true,
    };
    const highResult = calculateBusinessHealth(highScoreData);
    expect(['good', 'excellent']).toContain(highResult.status);
  });

  it('should include recommendations for each pillar', () => {
    const result = calculateBusinessHealth(mockInputData);
    
    result.pillars.forEach((pillar) => {
      expect(pillar.recommendations).toBeDefined();
      expect(pillar.recommendations.length).toBeGreaterThan(0);
    });
  });

  it('should generate unique IDs', () => {
    const result1 = calculateBusinessHealth(mockInputData);
    const result2 = calculateBusinessHealth(mockInputData);
    
    expect(result1.id).not.toBe(result2.id);
  });

  it('should include timestamp', () => {
    const before = Date.now();
    const result = calculateBusinessHealth(mockInputData);
    const after = Date.now();
    
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.timestamp).toBeLessThanOrEqual(after);
  });

  it('should use custom benchmarks when provided', () => {
    const customBenchmarks = {
      ...DEFAULT_BENCHMARKS,
      database: {
        reactivationRate: 0.5, // 50% instead of 25%
      },
    };
    
    const resultDefault = calculateBusinessHealth(mockInputData, DEFAULT_BENCHMARKS);
    const resultCustom = calculateBusinessHealth(mockInputData, customBenchmarks);
    
    const databaseDefault = resultDefault.pillars.find(p => p.name === 'database');
    const databaseCustom = resultCustom.pillars.find(p => p.name === 'database');
    
    // Revenue impact should be different with custom benchmark
    expect(databaseCustom!.revenueImpact).toBeGreaterThan(databaseDefault!.revenueImpact);
  });
});
