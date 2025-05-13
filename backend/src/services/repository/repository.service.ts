import { Nullable } from '@/util/types/types';

export default interface IEntityRepository<Type1> {
	find(): Promise<Type1[]>;
	// options?: ArrayResultOptions<SortOptions<Article, ArticleSortFields>>
	findById(id: string): Promise<Nullable<Type1>>;
	create(a: Type1): Promise<Type1>;
	edit(id: string, a: Type1): Promise<Type1>;
	delete(id: string): Promise<void>;
}
