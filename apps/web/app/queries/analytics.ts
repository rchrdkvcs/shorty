export interface AnalyticsOverview {
  totalClicks: number;
  totalLinks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
}

export interface ClicksByPeriod {
  date: string;
  clicks: number;
}

export interface TopLink {
  linkId: string;
  clicks: number;
  label: string | null;
  slugAuto: string;
  slugCustom: string | null;
  targetUrl: string;
}

export interface ClicksByReferrer {
  referrer: string;
  clicks: number;
}

export interface ClicksByCountry {
  country: string;
  clicks: number;
}

export interface ClicksByDevice {
  device: string;
  clicks: number;
}

export interface ClicksByBrowser {
  browser: string;
  clicks: number;
}

export interface LinkAnalytics {
  link: {
    id: string;
    label: string | null;
    slugAuto: string;
    slugCustom: string | null;
    targetUrl: string;
  };
  totalClicks: number;
  clicksByDay: ClicksByPeriod[];
  referrers: ClicksByReferrer[];
  countries: ClicksByCountry[];
  devices: ClicksByDevice[];
  browsers: ClicksByBrowser[];
}

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  overview: (days?: number) => [...ANALYTICS_QUERY_KEYS.all, "overview", days] as const,
  clicksByPeriod: (days?: number) => [...ANALYTICS_QUERY_KEYS.all, "clicks-by-period", days] as const,
  topLinks: (limit?: number) => [...ANALYTICS_QUERY_KEYS.all, "top-links", limit] as const,
  clicksByReferrer: (limit?: number) => [...ANALYTICS_QUERY_KEYS.all, "clicks-by-referrer", limit] as const,
  clicksByCountry: (limit?: number) => [...ANALYTICS_QUERY_KEYS.all, "clicks-by-country", limit] as const,
  clicksByDevice: () => [...ANALYTICS_QUERY_KEYS.all, "clicks-by-device"] as const,
  clicksByBrowser: () => [...ANALYTICS_QUERY_KEYS.all, "clicks-by-browser"] as const,
  linkAnalytics: (id: string, days?: number) => [...ANALYTICS_QUERY_KEYS.all, "link", id, days] as const,
};

export const useAnalyticsOverviewQuery = (days: MaybeRefOrGetter<number> = 30) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.overview(toValue(days)),
    query: () => useApi<AnalyticsOverview>(`/analytics/overview?days=${toValue(days)}`),
  });
};

export const useClicksByPeriodQuery = (days: MaybeRefOrGetter<number> = 30) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.clicksByPeriod(toValue(days)),
    query: () => useApi<ClicksByPeriod[]>(`/analytics/clicks-by-period?days=${toValue(days)}`),
  });
};

export const useTopLinksQuery = (limit: MaybeRefOrGetter<number> = 10) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.topLinks(toValue(limit)),
    query: () => useApi<TopLink[]>(`/analytics/top-links?limit=${toValue(limit)}`),
  });
};

export const useClicksByReferrerQuery = (limit: MaybeRefOrGetter<number> = 10) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.clicksByReferrer(toValue(limit)),
    query: () => useApi<ClicksByReferrer[]>(`/analytics/clicks-by-referrer?limit=${toValue(limit)}`),
  });
};

export const useClicksByCountryQuery = (limit: MaybeRefOrGetter<number> = 10) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.clicksByCountry(toValue(limit)),
    query: () => useApi<ClicksByCountry[]>(`/analytics/clicks-by-country?limit=${toValue(limit)}`),
  });
};

export const useClicksByDeviceQuery = () => {
  return useQuery({
    key: ANALYTICS_QUERY_KEYS.clicksByDevice(),
    query: () => useApi<ClicksByDevice[]>("/analytics/clicks-by-device"),
  });
};

export const useClicksByBrowserQuery = () => {
  return useQuery({
    key: ANALYTICS_QUERY_KEYS.clicksByBrowser(),
    query: () => useApi<ClicksByBrowser[]>("/analytics/clicks-by-browser"),
  });
};

export const useLinkAnalyticsQuery = (id: MaybeRefOrGetter<string>, days: MaybeRefOrGetter<number> = 30) => {
  return useQuery({
    key: () => ANALYTICS_QUERY_KEYS.linkAnalytics(toValue(id), toValue(days)),
    query: () => useApi<LinkAnalytics>(`/analytics/links/${toValue(id)}?days=${toValue(days)}`),
  });
};
