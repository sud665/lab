// Mock Data - Barrel Export

// Common
export {
  mockUsers,
  statusMap,
  formatDate,
  formatDateTime,
  formatCurrency,
} from './common';
export type { User } from './common';

// List
export {
  mockMembers,
  mockProducts,
  mockNotifications,
} from './list';
export type { Member, Product, Notification } from './list';

// Dashboard
export {
  mockStats,
  mockMonthlyRevenue,
  mockMemberGrowth,
  mockCategoryDistribution,
  mockRecentActivities,
} from './dashboard';
export type {
  StatCard,
  ChartDataPoint,
  CategoryData,
  RecentActivity,
} from './dashboard';

// Calendar
export {
  mockEvents,
  mockAttendance,
} from './calendar';
export type { CalendarEvent, AttendanceRecord } from './calendar';

// Chat
export { mockChatMessages } from './chat';
export type { ChatMessage } from './chat';

// Form
export { mockFormFields } from './form';
export type { FormField, FormConfig } from './form';

// Settings
export { mockSettingsSections } from './settings';
export type { SettingsItem, SettingsSection } from './settings';
