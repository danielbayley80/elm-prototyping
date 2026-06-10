/**
 * Capture prototype screenshots for the health connection user story.
 * Usage: node scripts/capture-journey-screenshots.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../../docs/requirements/screenshots')

async function resolveBaseUrl() {
  if (process.argv[2]) return process.argv[2]
  for (const port of [5174, 5173, 5175, 4173]) {
    try {
      const res = await fetch(`http://localhost:${port}/`)
      const html = await res.text()
      if (html.includes('ELM Health Prototype')) {
        return `http://localhost:${port}`
      }
    } catch {
      // try next port
    }
  }
  throw new Error(
    'Could not find ELM Health Prototype dev server. Start with `npm run dev` and pass the URL if needed: npm run screenshots:journey -- http://localhost:5174',
  )
}

const mockCapabilities = {
  repeatPrescriptionsEnabled: true,
  appointmentsEnabled: true,
  medicalRecordEnabled: true,
  medicalRecord: {
    allergies: true,
    testResults: true,
    immunisations: true,
    documents: true,
    medication: true,
    consultations: true,
    problems: true,
  },
  practiceAppointmentsSupported: true,
  practiceMedicalRecordSupported: true,
  practiceRepeatPrescriptionsSupported: true,
}

const connectedSource = {
  id: 'nhs-england-gp',
  name: 'NHS GP (England)',
  region: 'England',
  connectedAt: '2025-06-09T10:00:00.000Z',
  lastSyncedAt: '2025-06-09T10:00:00.000Z',
  syncStatus: 'up-to-date',
  practiceName: 'Riverside Medical Centre, Manchester',
  patientId: '460a6d87-689c-4661-a526-a52450bbe2d7',
  capabilities: mockCapabilities,
}

const connectedState = {
  connection: {
    connectedSources: [connectedSource],
    syncPreferences: {
      appointmentsToCalendar: false,
      prescriptionsToCalendar: false,
      notificationsEnabled: true,
    },
    pending: null,
  },
}

const pendingSource = {
  connection: {
    connectedSources: [],
    syncPreferences: connectedState.connection.syncPreferences,
    pending: {
      sourceId: 'nhs-england-gp',
      sourceName: 'NHS GP (England)',
      region: 'England',
      gpCredentials: null,
      patientId: null,
      consentGiven: false,
    },
  },
}

const pendingWithConsent = {
  connection: {
    ...pendingSource.connection,
    pending: { ...pendingSource.connection.pending, consentGiven: true },
  },
}

const connectedWithShares = {
  ...connectedState,
  shares: [
    {
      id: 'share-sarah',
      recipientId: 'recipient-sarah',
      recipientName: 'Sarah Mitchell',
      recipientRelation: 'Daughter',
      permissions: {
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
      },
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
      permissions: {
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
      },
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
      ],
    },
  ],
  lpaHealthWelfareActive: true,
}

const sarahPermissions = {
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

const pendingShareBase = {
  recipientId: 'recipient-emma',
  recipientName: 'Emma Mitchell',
  recipientRelation: 'Daughter',
  permissions: {
    appointments: 'view',
    prescriptions: 'none',
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
  },
  lpaExpandedSections: [],
  activation: 'always',
}

const sharingEditScope = {
  ...connectedWithShares,
  pendingShare: {
    recipientId: 'recipient-sarah',
    recipientName: 'Sarah Mitchell',
    recipientRelation: 'Daughter',
    permissions: sarahPermissions,
    lpaExpandedSections: [],
    activation: 'always',
    editingShareId: 'share-sarah',
  },
}

const sharingAddRecipient = { ...connectedWithShares, pendingShare: null }
const sharingAddScope = { ...connectedWithShares, pendingShare: pendingShareBase }
const sharingAddTerms = { ...connectedWithShares, pendingShare: pendingShareBase }
const sharingAddConsent = {
  ...connectedWithShares,
  pendingShare: { ...pendingShareBase, activation: 'lpa_gated' },
}

async function capture(browser, baseUrl, name, route, storagePayload, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await context.addInitScript((value) => {
    localStorage.setItem('elm-health-prototype', JSON.stringify(value))
  }, storagePayload)
  const page = await context.newPage()

  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' })
  if (options.waitFor) {
    await page.getByText(options.waitFor, { exact: false }).first().waitFor({ timeout: 15000 })
  } else {
    await page.waitForTimeout(500)
  }
  const file = path.join(outDir, `${name}.png`)
  if (options.locator) {
    await options.locator(page).first().screenshot({ path: file })
  } else {
    await page.screenshot({ path: file, fullPage: options.fullPage ?? false })
  }
  console.log(`Saved ${file}`)
  await context.close()
}

async function main() {
  const baseUrl = await resolveBaseUrl()
  console.log(`Using ${baseUrl}`)

  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()

  const empty = {
    connection: {
      connectedSources: [],
      syncPreferences: connectedState.connection.syncPreferences,
      pending: null,
    },
    shares: [],
    pendingShare: null,
    lpaHealthWelfareActive: true,
  }

  await capture(browser, baseUrl, '01-dashboard-unconnected', '/', empty)
  await capture(browser, baseUrl, '02-dashboard-healthcare-card', '/', empty, {
    locator: (page) =>
      page
        .locator('div.rounded-xl')
        .filter({ has: page.getByRole('heading', { name: 'Healthcare' }) }),
  })
  await capture(browser, baseUrl, '03-healthcare-hub-unconnected', '/healthcare', empty)
  await capture(browser, baseUrl, '04-select-source', '/healthcare/connect', empty)
  await capture(browser, baseUrl, '05-consent', '/healthcare/connect/consent', pendingSource, {
    fullPage: true,
  })
  await capture(browser, baseUrl, '06-nhs-login', '/healthcare/connect/nhs', pendingWithConsent)
  await capture(browser, baseUrl, '07-capabilities-onboarding', '/healthcare/connect/capabilities', connectedState)
  await capture(browser, baseUrl, '08-dashboard-connected', '/', connectedState)
  await capture(browser, baseUrl, '09-healthcare-hub-connected', '/healthcare', connectedWithShares)
  await capture(browser, baseUrl, '10-connected-sources', '/healthcare/sources', connectedState)

  await capture(browser, baseUrl, '11-sharing-overview', '/healthcare/sharing', connectedWithShares, {
    fullPage: true,
    waitFor: 'Active sharing',
  })
  await capture(browser, baseUrl, '12-sharing-add-recipient', '/healthcare/sharing/add', sharingAddRecipient, {
    waitFor: 'Who would you like to share with?',
  })
  await capture(browser, baseUrl, '13-sharing-add-scope', '/healthcare/sharing/add/scope', sharingAddScope, {
    fullPage: true,
    waitFor: 'What would you like to share?',
  })
  await capture(browser, baseUrl, '14-sharing-add-terms', '/healthcare/sharing/add/terms', sharingAddTerms, {
    fullPage: true,
    waitFor: 'When should access apply?',
  })
  await capture(browser, baseUrl, '15-sharing-add-consent', '/healthcare/sharing/add/consent', sharingAddConsent, {
    fullPage: true,
    waitFor: 'Consent to share your health data',
  })
  await capture(browser, baseUrl, '16-sharing-edit-scope', '/healthcare/sharing/add/scope', sharingEditScope, {
    fullPage: true,
    waitFor: 'Edit access permissions',
  })

  await browser.close()
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
