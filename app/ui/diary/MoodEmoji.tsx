export default function MoodEmoji({
  mood,
  icon: Icon,
  register,
  getValues,
}: any) {
  return (
    <div>
      <label htmlFor={mood}>
        <Icon
          selected={getValues().mood === mood}
          className="size-8 rounded-full hover:shadow-rad"
        />
      </label>
      <input
        type="radio"
        id={mood}
        value={mood}
        {...register("mood")}
        className="hidden"
      />
    </div>
  );
}
