import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const notesDirectory = join(process.cwd(), '_notes')
const lettersDirectory = join(process.cwd(), '_notes')

export function getNotesSlugs() {
  return fs.readdirSync(notesDirectory)
}

export function getNoteBySlug(slug, fields) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = join(notesDirectory, `${realSlug}.mdx`)
  console.log("fullPath:", fullPath)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = `${realSlug}.mdx`
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })
  console.log("Items:", items)

  return items
}

export function getAllNotes(fields) {

  const slugs = getNotesSlugs()
  const posts = slugs
    .map((slug) => getNoteBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getLettersSlugs() {
  return fs.readdirSync(lettersDirectory)
}

export function getLetterBySlug(slug, fields) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(lettersDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)


  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllLetters(fields) {
  const slugs = getLettersSlugs()
  const posts = slugs
    .map((slug) => getLetterBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}