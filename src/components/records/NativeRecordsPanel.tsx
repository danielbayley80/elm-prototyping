import { FileText } from 'lucide-react'
import { getSourceSystem, type SourceSystemId } from '../../config/source-config'
import { mockNativeDocuments } from '../../mocks/native-records'
import { formatDate } from '../../lib/utils'
import { Badge } from '../shared/Badge'

export function NativeRecordsPanel() {
  const bySource = mockNativeDocuments.reduce<Record<string, typeof mockNativeDocuments>>(
    (acc, item) => {
      const key = item.sourceSystem
      acc[key] = acc[key] ?? []
      acc[key].push(item)
      return acc
    },
    {},
  )

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Source-specific record content</h2>
        <p className="text-sm text-gray-600 mt-1">
          Some items from your connected systems cannot be shown in the unified table without
          losing structure. They are displayed here using each supplier&apos;s native layout.
        </p>
      </div>

      {(Object.keys(bySource) as SourceSystemId[]).map((sourceId) => {
        const source = getSourceSystem(sourceId)!
        const items = bySource[sourceId]

        return (
          <div
            key={sourceId}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div
              className="px-4 py-3 border-b border-gray-100 flex items-center gap-2"
              style={{ backgroundColor: source.color + '10' }}
            >
              <FileText className="h-4 w-4" style={{ color: source.color }} />
              <h3 className="font-medium text-gray-900">{source.label} — documents</h3>
              <Badge variant="muted" className="ml-auto">
                Native view
              </Badge>
            </div>
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      /* prototype — native viewer would open here */
                    }}
                  >
                    <div className="flex flex-wrap items-start gap-2 justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <div className="text-gray-900">{item.category}</div>
                        <div className="text-gray-500">{formatDate(item.date)}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
