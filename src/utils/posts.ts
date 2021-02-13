import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'

interface Post {
  id: string
  title: string
  description: string
  date: string
}

type PostsByDate = Array<Post>

interface MatterResultData {
  title: string
  description: string
  date: string
}

const postsDirectory = path.join(process.cwd(), 'src/posts')

export function getSortedPostsData(): PostsByDate {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as MatterResultData)
    }
  })

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1

    return -1
  })
}

type ListFileNames = Array<{ params: { id: string } }>

export function getAllPostIds(): ListFileNames {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }))
}

interface MorePosts {
  nextPost: Post | null
  previousPost: Post | null
}

function getMorePosts(currentPostId: string): MorePosts {
  const allPostsData = getSortedPostsData()

  const currentPostIndex = allPostsData.findIndex(
    post => post.id === currentPostId
  )

  let nextPost = null
  let previousPost = null

  if (currentPostIndex === 0) {
    previousPost = allPostsData[currentPostIndex + 1]
  } else if (currentPostIndex === allPostsData.length - 1) {
    nextPost = allPostsData[currentPostIndex - 1]
  } else {
    nextPost = allPostsData[currentPostIndex - 1]
    previousPost = allPostsData[currentPostIndex + 1]
  }

  return { nextPost, previousPost }
}

interface PostData {
  id: string
  title: string
  description: string
  date: string
  contentHtml: string
  nextPost: Post | null
  previousPost: Post | null
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  // Use remark-prism to support syntax hightlighting
  const processedContent = await remark()
    .use(html)
    .use(prism)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  const { title, description, date } = matterResult.data

  // Get nextPost and previousPost based on current post id
  const { nextPost, previousPost } = getMorePosts(id)

  // Combine the data with the id and contentHtml
  return {
    id,
    title,
    description,
    date,
    contentHtml,
    nextPost,
    previousPost
  }
}
