import axiosApi from './config';
import {
  GetWeeklyAnalyticsResponse,
  NewUsersStatusAnalyticsResponse,
  ChurnUsersAnalyticsResponse,
  UsersSubscriptionAnalyticsResponse
} from 'types/analytics';

const DEFAULT_DAYS_PERIOD = '7'; /* 1 week by default*/

const analyticsApi = {
  getWeeklyAnalytics(data: any): Promise<GetWeeklyAnalyticsResponse> {
    const url = 'members/members-weekly-count-data';
    return axiosApi.get(url);
  },
  getNewUsersStatusAnalytics({ daysCount = DEFAULT_DAYS_PERIOD }): Promise<NewUsersStatusAnalyticsResponse> {
    const url = `/analytics/new-users/${daysCount}`;
    return axiosApi.get(url);
  },
  getChurnUsersAnalytics({ daysCount = DEFAULT_DAYS_PERIOD }): Promise<ChurnUsersAnalyticsResponse> {
    const url = `/analytics/churn-users/${daysCount}`;
    return axiosApi.get(url);
  },
  getUsersSubscriptionAnalytics({ daysCount = DEFAULT_DAYS_PERIOD }): Promise<UsersSubscriptionAnalyticsResponse> {
    const url = `/analytics/users-subscriptions/${daysCount}`;
    return axiosApi.get(url);
  },
};

export default analyticsApi;
