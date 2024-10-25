type ApiAction<T> = (
  params: T
) => Promise<{ success?: { data: any }; error?: string }>;

const handleApiSearchCall = async <T, U>(
  action: ApiAction<T>,
  params: T,
  setContext: (data: U) => void,
  setLoading?: (loading: boolean) => void
) => {
  setLoading?.(true);

  try {
    const { success, error } = await action(params);

    if (error) {
      console.error(`Error in ${action.name}:`, error);
      throw new Error(error);
    }
    if (success) {
      setContext(success.data);
    } else {
      setContext([] as U);
    }
  } catch (error) {
    console.error(`API call failed:`, error);
  } finally {
    setLoading?.(false);
  }
};

export default handleApiSearchCall;
