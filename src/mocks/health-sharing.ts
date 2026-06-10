import type { HealthShare, SharePermissionSet } from '../types/health-sharing'
import { defaultSharePermissions } from '../types/health-sharing'

export const mockShareRecipients = [
  {
    id: 'recipient-emma',
    name: 'Emma Mitchell',
    relation: 'Daughter',
  },
  {
    id: 'recipient-james',
    name: 'James Mitchell',
    relation: 'Son',
    isAttorney: true,
    hasExistingShare: true,
  },
  {
    id: 'recipient-sarah',
    name: 'Sarah Mitchell',
    relation: 'Daughter',
    hasExistingShare: true,
  },
  {
    id: 'recipient-gp',
    name: 'Dr. Helen Brooks',
    relation: 'GP · Riverside Medical Centre',
  },
]

const sarahPermissions: SharePermissionSet = {
  appointments: 'view',
  prescriptions: 'view',
  recordSections: {
    medications: 'active',
    conditions: 'none',
    allergies: 'none',
    problems: 'none',
    testResults: 'none',
    consultations: 'none',
    immunisations: 'none',
    documents: 'none',
  },
}

const jamesPermissions: SharePermissionSet = {
  appointments: 'manage',
  prescriptions: 'manage',
  recordSections: {
    medications: 'all',
    conditions: 'all',
    allergies: 'all',
    problems: 'all',
    testResults: 'all',
    consultations: 'all',
    immunisations: 'all',
    documents: 'all',
  },
}

const patriciaPermissions: SharePermissionSet = {
  appointments: 'view',
  prescriptions: 'none',
  recordSections: {
    medications: 'none',
    conditions: 'none',
    allergies: 'none',
    problems: 'none',
    testResults: 'none',
    consultations: 'none',
    immunisations: 'none',
    documents: 'none',
  },
}

export const mockHealthShares: HealthShare[] = [
  {
    id: 'share-sarah',
    recipientId: 'recipient-sarah',
    recipientName: 'Sarah Mitchell',
    recipientRelation: 'Daughter',
    permissions: sarahPermissions,
    activation: 'always',
    status: 'active',
    createdAt: '2025-11-12T10:00:00.000Z',
    consentRecordedAt: '2025-11-12T10:05:00.000Z',
    lastAccessedAt: '2026-06-02T14:22:00.000Z',
    termsSummary:
      'Can view your appointments and prescriptions. Can view some aspects of your active record.',
    accessLog: [
      {
        id: 'log-1',
        accessedAt: '2026-06-02T14:22:00.000Z',
        section: 'appointments',
        note: 'Viewed upcoming appointments',
      },
      {
        id: 'log-2',
        accessedAt: '2026-05-18T09:15:00.000Z',
        section: 'medications',
        note: 'Viewed medication list',
      },
    ],
  },
  {
    id: 'share-james',
    recipientId: 'recipient-james',
    recipientName: 'James Mitchell',
    recipientRelation: 'Son',
    isAttorney: true,
    permissions: jamesPermissions,
    activation: 'lpa_gated',
    status: 'active',
    createdAt: '2025-09-01T11:30:00.000Z',
    consentRecordedAt: '2025-09-01T11:35:00.000Z',
    lastAccessedAt: '2026-06-07T08:45:00.000Z',
    termsSummary:
      'Can manage your appointments and prescriptions. Can view everything.',
    accessLog: [
      {
        id: 'log-3',
        accessedAt: '2026-06-07T08:45:00.000Z',
        note: 'Viewed full health record',
      },
      {
        id: 'log-4',
        accessedAt: '2026-05-30T16:10:00.000Z',
        section: 'medical_records',
        note: 'Reviewed medical records before attorney meeting',
      },
    ],
  },
  {
    id: 'share-patricia-revoked',
    recipientId: 'recipient-patricia',
    recipientName: 'Patricia Webb',
    recipientRelation: 'Former carer',
    permissions: patriciaPermissions,
    activation: 'always',
    status: 'revoked',
    createdAt: '2024-06-20T09:00:00.000Z',
    consentRecordedAt: '2024-06-20T09:02:00.000Z',
    revokedAt: '2025-12-15T12:00:00.000Z',
    lastAccessedAt: '2025-12-10T11:30:00.000Z',
    termsSummary:
      'Patricia could view upcoming appointments while providing care. Access revoked when care arrangement ended.',
    accessLog: [
      {
        id: 'log-5',
        accessedAt: '2025-12-10T11:30:00.000Z',
        section: 'appointments',
        note: 'Final access before revocation',
      },
    ],
  },
]

export const mockPendingSharePermissions = defaultSharePermissions()
