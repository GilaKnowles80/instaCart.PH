export interface IPost {
	id: string;
	title: string;
	content: string;
	authorId: string;
	tags?: string[];
	status: 'draft' | 'published' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}

// Quick structural boilerplate type definitions for creating new posts
export type CreatePostInput = Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>;
