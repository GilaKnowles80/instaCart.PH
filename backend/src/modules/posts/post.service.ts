import { PostRepository } from '../../db/repository.js';
import type { IPost, CreatePostInput } from './post.model.js';

export class PostService {
	static async createPost(input: CreatePostInput): Promise<IPost> {
		const newPost = await PostRepository.create({
			id: `post_${Math.random().toString(36).slice(2, 9)}`,
			title: input.title,
			content: input.content,
			authorId: input.authorId,
			tags: input.tags,
			status: input.status || 'draft',
		});
		return newPost as unknown as IPost;
	}

	static async getAllPublishedPosts(): Promise<IPost[]> {
		const posts = await PostRepository.getAllPublished();
		return posts as unknown as IPost[];
	}

	static async getPostById(id: string): Promise<IPost | null> {
		const post = await PostRepository.findById(id);
		return post ? (post as unknown as IPost) : null;
	}
}
