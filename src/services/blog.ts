export interface BlogPost {
  id: string
  title: string
  summary: string | null
  introduction: string | null
  content: string | null
  conclusion: string | null
  category: string | null
  image_url: string | null
  tags: string[] | null
  author_id: string | null
  published_at: string | null
  created_at: string
  status: string
  is_active: boolean
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  content: string
  status: string
  created_at: string
}

export const blogService = {
  async getPosts() {
    return [] as BlogPost[]
  },

  async getPostById(id: string) {
    return {
      id,
      title: 'Mock Post',
      summary: 'This is a mock summary.',
      introduction: 'Intro',
      content: 'Content',
      conclusion: 'Conclusion',
      category: 'Mock',
      image_url: null,
      tags: [],
      author_id: '1',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: 'published',
      is_active: true,
    } as BlogPost
  },

  async createPost(post: Partial<BlogPost>) {
    return { id: Math.random().toString(), ...post } as BlogPost
  },

  async updatePost(id: string, post: Partial<BlogPost>) {
    return { id, ...post } as BlogPost
  },

  async deletePost(id: string) {},
}

export const commentService = {
  async getComments(postId: string) {
    return [] as BlogComment[]
  },

  async addComment(comment: Partial<BlogComment>) {
    return {
      id: Math.random().toString(),
      ...comment,
      status: 'approved',
      created_at: new Date().toISOString(),
    } as BlogComment
  },
}
