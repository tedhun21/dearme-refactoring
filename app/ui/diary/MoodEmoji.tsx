export default function MoodEmoji({
  mood,
  icon: Icon,
  register,
  watchValue,
}: any) {
  return (
    <div>
      <label htmlFor={mood}>
        <Icon
          selected={watchValue === mood}
          className="size-8 cursor-pointer rounded-full hover:shadow-rad"
        />
      </label>
      <input type="radio" id={mood} value={mood} {...register("mood")} hidden />
    </div>
  );
}
