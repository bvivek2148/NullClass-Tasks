import PreferencesForm from "@/components/notifications/PreferencesForm";

export default function ProfilePage() {
  const demoUserId = 1;
  return (
    <div className="mx-auto w-full max-w-6xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your notification preferences.</p>
      </div>
      <PreferencesForm userId={demoUserId} />
    </div>
  );
}