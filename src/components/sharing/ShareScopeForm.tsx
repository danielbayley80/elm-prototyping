import type {
  FeatureAccess,
  RecordSectionKey,
  RecordVisibility,
  SharePermissionSet,
} from '../../types/health-sharing'
import {
  featureAccessLabels,
  recordSectionLabels,
  recordVisibilityLabels,
} from '../../types/health-sharing'

const featureAccessOptions: FeatureAccess[] = ['none', 'view', 'manage']

const recordVisibilityOptions: RecordVisibility[] = ['none', 'active', 'all']

const recordSectionKeys = Object.keys(recordSectionLabels) as RecordSectionKey[]

function ThreeWaySelector<T extends string>({
  name,
  value,
  options,
  labels,
  onChange,
}: {
  name: string
  value: T
  options: T[]
  labels: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 text-center text-xs sm:text-sm transition-colors ${
            value === option
              ? 'border-nhs-blue bg-blue-50 ring-1 ring-nhs-blue font-medium text-gray-900'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {labels[option]}
        </label>
      ))}
    </div>
  )
}

interface ShareScopeFormProps {
  permissions: SharePermissionSet
  onChange: (permissions: SharePermissionSet) => void
  recipientName?: string
}

export function ShareScopeForm({
  permissions,
  onChange,
  recipientName,
}: ShareScopeFormProps) {
  const rows: {
    key: string
    label: string
    kind: 'feature' | 'record'
    featureKey?: 'appointments' | 'prescriptions'
    recordKey?: RecordSectionKey
  }[] = [
    { key: 'appointments', label: 'Appointments', kind: 'feature', featureKey: 'appointments' },
    {
      key: 'prescriptions',
      label: 'Repeat prescriptions',
      kind: 'feature',
      featureKey: 'prescriptions',
    },
    ...recordSectionKeys.map((section) => ({
      key: section,
      label: recordSectionLabels[section],
      kind: 'record' as const,
      recordKey: section,
    })),
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Choose what {recipientName ?? 'this person'} can access for each area below.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse">
          <caption className="px-4 pt-4 pb-2 text-left text-sm font-semibold text-gray-900">
            Sharing permissions
          </caption>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                scope="col"
                className="w-[9rem] sm:w-[11rem] px-4 py-2.5 text-left text-xs font-medium text-gray-500"
              >
                Area
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium text-gray-500"
              >
                Access
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-gray-100 last:border-0">
                <th
                  scope="row"
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900 align-middle"
                >
                  {row.label}
                </th>
                <td className="px-4 py-3">
                  {row.kind === 'feature' && row.featureKey ? (
                    <ThreeWaySelector
                      name={row.featureKey}
                      value={permissions[row.featureKey]}
                      options={featureAccessOptions}
                      labels={featureAccessLabels}
                      onChange={(value) =>
                        onChange({ ...permissions, [row.featureKey!]: value })
                      }
                    />
                  ) : row.recordKey ? (
                    <ThreeWaySelector
                      name={`record-${row.recordKey}`}
                      value={permissions.recordSections[row.recordKey]}
                      options={recordVisibilityOptions}
                      labels={recordVisibilityLabels}
                      onChange={(visibility) =>
                        onChange({
                          ...permissions,
                          recordSections: {
                            ...permissions.recordSections,
                            [row.recordKey!]: visibility,
                          },
                        })
                      }
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
