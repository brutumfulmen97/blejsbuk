import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const users = await serverClient.getUsers();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>cao</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
        </div>
      ))}
    </main>
  );
}
