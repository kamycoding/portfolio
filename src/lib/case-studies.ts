import fs from 'fs' // Comment this line if using remote fetching
import path from 'path' // Comment this line if using remote fetching

import matter from 'gray-matter'

export type CaseStudy = {
  metadata: CaseStudyMetadata
  content: string
}

export type CaseStudyMetadata = {
  slug: string
  title?: string
  description?: string
  organisation?: string
  role?: string
  duration?: string
  tools?: string[]
  publishedAt?: string
  image?: string
  heroImage?: string
  logo?: string
}

// local content directory (comment below line if using remote fetching)
const rootDirectory = path.join(process.cwd(), 'src', 'content', 'case-studies')

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const filePath = path.join(rootDirectory, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })

    const { data, content } = matter(fileContent)

    return { metadata: { ...data, slug }, content }
  } catch {
    return null
  }
}

export async function getCaseStudies(limit?: number): Promise<CaseStudyMetadata[]> {
  try {
    const files = fs.readdirSync(rootDirectory)
    const caseStudies = await Promise.all(files.map(async (file: any) => await getCaseStudyMetadata(file)))

    // Sort case studies by published date
    const sortedCaseStudies = caseStudies.sort((a, b) => {
      if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
        return 1
      } else {
        return -1
      }
    })

    if (limit) {
      return sortedCaseStudies.slice(0, limit)
    }

    return sortedCaseStudies
  } catch (error) {
    console.error('Error fetching case studies:', error)

    return []
  }
}

export async function getCaseStudyMetadata(filepath: string): Promise<CaseStudyMetadata> {
  try {
    const slug = filepath.replace(/\.mdx$/, '')

    const filePath = path.join(rootDirectory, filepath)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })

    const { data } = matter(fileContent)

    return { ...data, slug }
  } catch (error) {
    console.error(`Error fetching metadata for ${filepath}:`, error)

    return { slug: filepath.replace(/\.mdx$/, '') }
  }
}
