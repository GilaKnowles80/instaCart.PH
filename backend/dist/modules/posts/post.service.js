import { PostRepository } from '../../db/repository.js';
export class PostService {
    static async createPost(input) {
        const newPost = await PostRepository.create({
            id: `post_${Math.random().toString(36).slice(2, 9)}`,
            title: input.title,
            content: input.content,
            authorId: input.authorId,
            tags: input.tags,
            status: input.status || 'draft',
        });
        return newPost;
    }
    static async getAllPublishedPosts() {
        const posts = await PostRepository.getAllPublished();
        return posts;
    }
    static async getPostById(id) {
        const post = await PostRepository.findById(id);
        return post ? post : null;
    }
}
//# sourceMappingURL=post.service.js.map