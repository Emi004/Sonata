function ProfileSectionRow({ title, description }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs uppercase tracking-wide text-base-content/50">
          Coming soon
        </span>
      </div>
      <div className="h-px w-full bg-base-300/60" />
      {description && (
        <p className="text-sm text-base-content/70 max-w-xl">{description}</p>
      )}
      <div className="mt-2 overflow-x-auto">
        <div className="flex gap-4 pb-2 min-w-full">
          {/* future cards for this section will go here */}
        </div>
      </div>
    </section>
  );
}

export default ProfileSectionRow;
