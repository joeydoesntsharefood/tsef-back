interface Return<T> {
  success: boolean;
  data?: T;
  error?: T;
}

function handleResponse<T>(success: boolean, data?: T): Return<T> {
  return {
    success,
    ...( success && data ? { data } : { error: data })
  }
};

export default handleResponse;