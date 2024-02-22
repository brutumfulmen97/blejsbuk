// "use client";

// import { useForm, type SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { trpc } from "~/app/_trpc/client";
// import { useRouter } from "next/navigation";

// type Inputs = {
//   title: string;
//   content: string;
// };

// const schema = z.object({
//   title: z.string().min(2),
//   content: z.string().min(2),
// });

// const Form = ({}) => {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<Inputs>({
//     resolver: zodResolver(schema),
//   });
//   const onSubmit: SubmitHandler<Inputs> = (data) => {
//     mutation.mutate(data);
//   };

//   const mutation = trpc.submitPost.useMutation({
//     onSettled: () => {
//       router.push("/");
//       router.refresh();
//     },
//   });

//   const getTodos = trpc.getUsers.useQuery(undefined, {
//     initialData: [],
//   });

//   return (
//     <>
//       {getTodos?.data?.map((todo) => (
//         <div key={todo.id}>{todo.name}</div>
//       ))}
//       <form
//         className="w-[fit-content] flex flex-col gap-4 m-4 p-8 items-center rounded-md bg-slate-500 text-white outline-dotted"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <label htmlFor="title" className="text-amber-300">
//           Title
//         </label>
//         <input
//           placeholder="..."
//           className="text-teal-500 px-4"
//           type="text"
//           defaultValue=""
//           {...register("title")}
//         />
//         {errors.title && (
//           <span className="text-red-400 font-bold">
//             This field needs to be at least 2 chars long...
//           </span>
//         )}
//         <label htmlFor="content">Content</label>
//         <input
//           placeholder="..."
//           className="text-teal-500 px-4"
//           type="text"
//           defaultValue=""
//           {...register("content")}
//         />
//         {errors.content && (
//           <span className="text-red-400 font-bold">
//             This field needs to be at least 2 chars long...
//           </span>
//         )}
//         <button
//           type="submit"
//           className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-800 rounded-md"
//         >
//           SUBMIT
//         </button>
//       </form>
//     </>
//   );
// };

// export default Form;
