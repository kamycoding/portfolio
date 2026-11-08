import { notFound } from 'next/navigation'

// Catches unknown paths inside a locale so they get the localized 404 instead of the root one.
const CatchAllPage = () => notFound()

export default CatchAllPage
