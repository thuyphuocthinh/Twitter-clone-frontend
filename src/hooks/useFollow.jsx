import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        ]);
        return data;
      } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
    },
  });
  return { follow, isPending };
};

export default useFollow;
