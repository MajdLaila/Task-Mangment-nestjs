
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    limit: number;
    prev: number | null;
    next: number | null;
  };
}

 export const paginate = async <T>(
  model: any,
  args: any,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;

   const [data, total] = await Promise.all([
    model.findMany({ ...args, skip, take: limit }),
    model.count({ where: args.where }),
  ]);

  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      limit,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  };
};
