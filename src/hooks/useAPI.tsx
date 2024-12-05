import { useEffect, useState } from "react";

export default function useAPI<T = any>(
  fn: () => Promise<T>,
  options: {
    fetchOnMount?: boolean;
  } = {}
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data?: T;
  }>({ loading: false, error: null });

  const call = async () => {
    setState({ loading: true, error: null });
    try {
      const data = await fn();
      setState({ loading: false, error: null, data });
    } catch (error) {
      setState({ loading: false, error: error as string });
    }
  };

  useEffect(() => {
    if (options.fetchOnMount) {
      call();
    }
  }, []);

  return {
    ...state,
    call,
    reset: () => setState({ loading: false, error: null, data: undefined }),
  };
}
