import CreateCommunityForm from "~/components/CreateCommunityForm";
import { BackgroundGradient } from "~/components/ui/background-gradient-card";

function page() {
  return (
    <div className="max-w-[70vw] mx-auto mt-[15vh]">
      <BackgroundGradient>
        <div className="p-4 bg-neutral-900 rounded-2xl flex flex-col gap-4">
          <h1 className="text-2xl text-zinc-200 mb-4">Create new community</h1>
          <CreateCommunityForm />
        </div>
      </BackgroundGradient>
    </div>
  );
}

export default page;
