import CreateCommunityForm from "~/components/CreateCommunityForm";

function page() {
  return (
    <div>
      <h1 className="text-2xl text-zinc-200 mb-4">Create new community</h1>
      <CreateCommunityForm />
    </div>
  );
}

export default page;
