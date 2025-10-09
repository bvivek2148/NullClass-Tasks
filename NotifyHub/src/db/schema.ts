import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notificationTemplates = sqliteTable('notification_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull(),
  channel: text('channel').notNull(),
  locale: text('locale').notNull().default('en'),
  subject: text('subject'),
  bodyText: text('body_text').notNull(),
  bodyHtml: text('body_html'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notificationPreferences = sqliteTable('notification_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  channel: text('channel').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  locale: text('locale'),
  snoozeUntil: text('snooze_until'),
  mute: integer('mute', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  priority: text('priority').notNull().default('normal'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  channel: text('channel'),
  locale: text('locale').notNull().default('en'),
  templateKey: text('template_key'),
  data: text('data', { mode: 'json' }),
  status: text('status').notNull().default('queued'),
  scheduledAt: text('scheduled_at'),
  sentAt: text('sent_at'),
  error: text('error'),
  retryCount: integer('retry_count').default(0),
  lastRetryAt: text('last_retry_at'),
  nextRetryAt: text('next_retry_at'),
  failoverChannel: text('failover_channel'),
  failoverStatus: text('failover_status').default('not_attempted'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notificationHistory = sqliteTable('notification_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  notificationId: integer('notification_id').references(() => notifications.id).notNull(),
  channel: text('channel').notNull(),
  status: text('status').notNull(),
  provider: text('provider').notNull(),
  providerMessageId: text('provider_message_id'),
  attempt: integer('attempt').default(0),
  error: text('error'),
  occurredAt: text('occurred_at').notNull(),
});

export const templates = sqliteTable('templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  defaultLocale: text('default_locale').notNull().default('en'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const templateVersions = sqliteTable('template_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateId: integer('template_id').references(() => templates.id).notNull(),
  channel: text('channel').notNull(), // 'email', 'sms', 'push'
  version: integer('version').notNull(),
  status: text('status').notNull().default('draft'), // 'draft', 'active', 'archived'
  createdAt: text('created_at').notNull(),
});

export const templateLocales = sqliteTable('template_locales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateVersionId: integer('template_version_id').references(() => templateVersions.id).notNull(),
  locale: text('locale').notNull(),
  subject: text('subject'),
  text: text('text'),
  html: text('html'),
});

export const queueJobs = sqliteTable('queue_jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  notificationId: integer('notification_id').references(() => notifications.id).notNull(),
  jobId: text('job_id').notNull().unique(),
  queue: text('queue').notNull(),
  priority: integer('priority').notNull(),
  status: text('status').notNull(),
  attempts: integer('attempts').default(0),
  processedAt: text('processed_at'),
  failedAt: text('failed_at'),
  completedAt: text('completed_at'),
  error: text('error'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});