/**
 * PaginationInfo interface contains information about the pagination details.
 *
 * @property {number} totalItems - The total number of items in the dataset.
 * @property {number} totalPages - The total number of pages available for pagination.
 * @property {number} currentPage - The current page number being viewed.
 * @property {number} pageSize - The number of items per page.
 */
export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * PaginatedResult interface represents a result set that has been paginated.
 *
 * @property {T[]} items - The array of items retrieved for the current page.
 * @property {PaginationInfo} pagination - Pagination information including total items, total pages, current page, and page size.
 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * PaginationOptions interface contains options for pagination, including the page number and page size.
 *
 * @property {number} page - The page number to retrieve (default is 1).
 * @property {number} pageSize - The number of items per page (default is 10).
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/**
 * paginate function retrieves a paginated result from a model, including the requested items and pagination information.
 *
 * @param model - The Prisma model to query. It should have a `count` method for counting total items and a `findMany` method for retrieving items.
 * @param options - Pagination options including the page number and page size (optional).
 * @param where - The `where` filter used to query the model (optional).
 * @param include - The `include` object used for eager loading related data (optional).
 * @param orderBy - The `orderBy` criteria to order the results (optional).
 *
 * @returns {Promise<PaginatedResult<T>>} - A promise resolving to a paginated result containing items and pagination info.
 */
export async function paginate<
  T,
  WhereInput = Record<string, any>,
  Include = Record<string, any>,
  OrderBy = Record<string, any>,
>(
  model: {
    count: (args: { where?: WhereInput }) => Promise<number>;
    findMany: (args: {
      where?: WhereInput;
      include?: Include;
      orderBy?: OrderBy;
      skip?: number;
      take?: number;
    }) => Promise<T[]>;
  },
  options: PaginationOptions = {},
  where: WhereInput = {} as WhereInput,
  include: Include = {} as Include,
  orderBy: OrderBy = {} as OrderBy,
): Promise<PaginatedResult<T>> {
  const { page = 1, pageSize = 10 } = options;

  // Validate page number and page size
  const validatedPage = Math.max(page, 1);
  const validatedPageSize = Math.max(pageSize, 1);

  // Fetch total item count and paginated items in parallel
  const [totalItems, items] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      include,
      orderBy,
      skip: (validatedPage - 1) * validatedPageSize,
      take: validatedPageSize,
    }),
  ]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / validatedPageSize);

  return {
    items,
    pagination: {
      totalItems,
      totalPages,
      currentPage: validatedPage,
      pageSize: validatedPageSize,
    },
  };
}
