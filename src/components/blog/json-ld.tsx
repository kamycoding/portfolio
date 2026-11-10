import { serializeJsonLd } from '@/lib/blog/structured-data'

// React writes script text as is, so structured data needs no dangerouslySetInnerHTML (docs/adr/0005).
const JsonLd = ({ data }: Readonly<{ data: unknown }>) => (
  <script type='application/ld+json'>{serializeJsonLd(data)}</script>
)

export default JsonLd
