'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/lib/types';
import { RealTimeDataResponse, realTimeDataService } from '@/lib/realTimeData';

interface UseRealTimeDataOptions {
  refreshInterval?: number; // milliseconds
  enabled?: boolean;
}

interface UseRealTimeDataReturn {
  data: RealTimeDataResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useRealTimeData(
  origin: Location | null,
  destination: Location | null,
  options: UseRealTimeDataOptions = {}
): UseRealTimeDataReturn {
  const { refreshInterval = 5 * 60 * 1000, enabled = true } = options; // Default 5 minutes

  const [data, setData] = useState<RealTimeDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!origin || !destination || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const realTimeData = await realTimeDataService.getRealTimeData(origin, destination);
      setData(realTimeData);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Real-time data fetch failed, using fallback:', err);
      // Use fallback data instead of throwing error
      setData(realTimeDataService.getMockData());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [origin, destination, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || !origin || !destination) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, enabled, origin, destination]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
}

// Hook for traffic-aware emissions
export function useTrafficAwareEmissions(
  baseEmissions: number,
  transportMode: string,
  origin: Location | null,
  destination: Location | null
) {
  const { data: realTimeData } = useRealTimeData(origin, destination);
  
  const adjustedEmissions = realTimeData 
    ? realTimeDataService.calculateAdjustedEmissions(baseEmissions, transportMode, realTimeData)
    : baseEmissions;

  return {
    adjustedEmissions,
    trafficImpact: realTimeData?.traffic,
    emissionIncrease: adjustedEmissions - baseEmissions
  };
}

// Hook for public transport real-time info
export function usePublicTransportInfo(origin: Location | null, destination: Location | null) {
  const { data: realTimeData, loading, error } = useRealTimeData(origin, destination);

  return {
    delays: realTimeData?.publicTransport.delays,
    availability: realTimeData?.publicTransport.availability,
    loading,
    error
  };
}

// Hook for weather-based feasibility
export function useWeatherFeasibility(location: Location | null) {
  const { data: realTimeData, loading } = useRealTimeData(location, location);

  return {
    weather: realTimeData?.weather,
    walkingFeasible: (realTimeData?.weather.walkingFeasibility ?? 0) > 60,
    cyclingFeasible: (realTimeData?.weather.cyclingFeasibility ?? 0) > 60,
    loading
  };
}

// Hook for bike share availability
export function useBikeShareData(location: Location | null) {
  const { data: realTimeData, loading, error } = useRealTimeData(location, location);

  return {
    bikeShare: realTimeData?.bikeShare,
    hasAvailableBikes: (realTimeData?.bikeShare.availableBikes ?? 0) > 0,
    nearbyStation: (realTimeData?.bikeShare.stationDistance ?? 999) < 0.5, // Within 500m
    loading,
    error
  };
}
