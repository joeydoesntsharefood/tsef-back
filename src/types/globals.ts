export interface Pagination <T> {
  data: T;
  pagination: {
    page: number;
    totalDocs: number;
    pageSize: number;
    totalPages: number;
  }
}